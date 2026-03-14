"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import {
  CallParticipantsList,
  CallingState,
  useCallStateHooks,
  useCall,
  ParticipantView,
} from "@stream-io/video-react-sdk";
import { useState, useEffect, useRef } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Loader, MessageCircle, Send, Users, Gift, Circle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import EndCallButton from "./endcallButton";
import CustomCallControls from "./custom-call-controls";
import { Badge } from "@/components/ui/badge";
import { getLiveEventById } from "@/app/(dashboards)/imam/events/action";
import { Event } from "@/types/events";
import { toast } from "sonner";

import DonationModal from "./donationModal";
import Image from "next/image";

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  isDonation?: boolean;
  amount?: number;
}

interface LiveStreamRoomProps {
  userRole?: "host" | "viewer";
}

function LiveStreamRoom({ userRole = "viewer" }: LiveStreamRoomProps) {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(true); // Default to true on desktop
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatRefMobile = useRef<HTMLDivElement>(null);
  const chatRefDesktop = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { useCallCallingState, useParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants();
  const call = useCall();
  const [event, setEvent] = useState<Event | null>(null);
  const { id } = useParams();

  const viewerCount = participants.length;

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      const res = await getLiveEventById({ eventId: id as string });
      if (res.status === "success") {
        setEvent(res.event);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (userRole === "viewer" && call) {
      const enforceViewerRestrictions = async () => {
        await call.camera.disable();
        await call.microphone.disable();
      };
      const interval = setInterval(enforceViewerRestrictions, 1000);
      return () => clearInterval(interval);
    }
  }, [userRole, call]);

  useEffect(() => {
    const refs = [chatRefMobile.current, chatRefDesktop.current];
    refs.forEach((ref) => {
      if (ref) ref.scrollTop = ref.scrollHeight;
    });
  }, [chatMessages]);

  useEffect(() => {
    if (!call) return;
    const handleCustomEvent = (event: {
      type: string;
      user: { name?: string; id: string };
      custom: { message?: string; amount?: number; isAnonymous?: boolean };
    }) => {
      if (event.type === "chat_message") {
        const message: ChatMessage = {
          id: Date.now().toString(),
          user: event.user.name || event.user.id,
          message: event.custom.message || "",
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, message]);
      } else if (event.type === "donation") {
        const donation: ChatMessage = {
          id: Date.now().toString(),
          user: event.custom.isAnonymous
            ? "Anonymous Donor"
            : event.user.name || event.user.id,
          message: event.custom.message || "",
          timestamp: new Date(),
          isDonation: true,
          amount: event.custom.amount,
        };
        setChatMessages((prev) => [...prev, donation]);

        // Special toast notification for the host
        if (userRole === "host") {
          toast.success(`New Donation: $${event.custom.amount}!`, {
            description: event.custom.isAnonymous
              ? "From an anonymous donor"
              : `From ${event.user.name || event.user.id}`,
            duration: 5000,
          });
        }
      }
    };
    call.on("custom", handleCustomEvent);
    return () => call.off("custom", handleCustomEvent);
  }, [call, userRole]);

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0c]">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin w-8 h-8 text-purple-500" />
          <Button
            variant="outline"
            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            onClick={() =>
              router.push(userRole === "viewer" ? "/dashboard" : "/imam/events")
            }
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !call) return;
    await call.sendCustomEvent({
      type: "chat_message",
      custom: { message: newMessage.trim() },
    });
    setNewMessage("");
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0a0a0c] text-white font-sans">
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-[#0a0a0c]">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight">
              {event?.title || "Livestream"}
            </h1>
            <p className="text-sm text-gray-400">
              {event?.createdBy || "Host"} • started recently
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-red-500/10 text-red-500 border-none px-3 py-1 flex items-center gap-2">
              <Circle className="w-2 h-2 fill-current animate-pulse" />
              LIVE
            </Badge>
            <Badge className="bg-gray-800 text-gray-300 border-none px-3 py-1 flex items-center gap-2">
              <Users className="w-4 h-4" />
              {viewerCount.toLocaleString()}
            </Badge>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Video Area */}
          <main className="flex-1 relative bg-[#0f0f12] overflow-hidden m-4 rounded-2xl border border-gray-800 shadow-2xl">
            {/* Grid Background Effect */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#ffffff 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative size-full p-4">
              <CallLayouts />

              {/* Host Overlay Badge */}
              <div className="absolute bottom-8 left-8">
                <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-3">
                  <span className="font-semibold text-sm">
                    {event?.createdBy || "Imam"}
                  </span>
                  <Badge className="bg-purple-600 hover:bg-purple-700 text-[10px] font-bold py-0 h-5">
                    HOST
                  </Badge>
                </div>
              </div>
            </div>
          </main>

          {/* Sidebar (Chat & Participants) */}
          <aside
            className={cn(
              "w-[380px] flex flex-col bg-[#0a0a0c] border-l border-gray-800 transition-all duration-300",
              !showChat &&
                !showParticipants &&
                "w-0 border-none overflow-hidden",
            )}
          >
            {showChat && (
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-400" />
                    <h3 className="font-bold text-lg">Live Chat</h3>
                    <span className="bg-gray-800 text-gray-400 px-2 py-0.5 rounded text-xs font-bold">
                      {chatMessages.length}
                    </span>
                  </div>
                </div>

                {/* Chat Messages */}
                <div
                  ref={chatRefDesktop}
                  className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
                >
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "group animate-in fade-in slide-in-from-bottom-2 duration-300",
                        msg.isDonation
                          ? "bg-gradient-to-r from-yellow-500/10 to-transparent border-l-2 border-yellow-500 p-3 rounded-r-lg"
                          : "",
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-purple-400">
                            {msg.user}
                          </span>
                          {msg.isDonation && (
                            <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border-none text-[10px] font-bold">
                              ★ ${msg.amount}
                            </Badge>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-600 group-hover:text-gray-400 transition-colors">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed break-words">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-800 bg-[#0f0f12]">
                  <form onSubmit={sendMessage} className="relative mb-3">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="bg-[#1a1a1e] border-gray-700 focus:border-purple-500 h-12 pr-12 rounded-xl text-sm"
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-400"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </form>
                  {userRole === "viewer" && (
                    <Button
                      onClick={() => setIsDonationModalOpen(true)}
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold h-12 rounded-xl shadow-lg shadow-yellow-500/10 border-none flex items-center justify-center gap-2"
                    >
                      <Gift className="w-5 h-5" />
                      Send Donation
                    </Button>
                  )}
                </div>
              </div>
            )}

            {showParticipants && (
              <div className="absolute inset-y-0 right-0 w-80 bg-[#0a0a0c] border-l border-gray-800 z-50">
                <CallParticipantsList
                  onClose={() => setShowParticipants(false)}
                />
              </div>
            )}
          </aside>
        </div>

        {/* Bottom Controls */}
        <footer className="h-24 bg-[#0a0a0c] border-t border-gray-800 flex items-center justify-center relative px-6">
          <div className="flex items-center gap-4">
            <CustomCallControls
              userRole={userRole}
              onLeave={() => call?.leave()}
            />

            <div className="w-[1px] h-8 bg-gray-800 mx-2" />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowChat((prev) => !prev)}
              className={cn(
                "w-12 h-12 rounded-xl border border-gray-800 transition-all",
                showChat
                  ? "bg-purple-600 text-white border-purple-500"
                  : "bg-[#1a1a1e] text-gray-400 hover:bg-gray-800",
              )}
            >
              <MessageCircle className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowParticipants((prev) => !prev)}
              className={cn(
                "w-12 h-12 rounded-xl border border-gray-800 transition-all",
                showParticipants
                  ? "bg-purple-600 text-white border-purple-500"
                  : "bg-[#1a1a1e] text-gray-400 hover:bg-gray-800",
              )}
            >
              <Users className="w-5 h-5" />
            </Button>

            {!isPersonalRoom && userRole === "host" && (
              <div className="ml-4">
                <EndCallButton />
              </div>
            )}
          </div>
        </footer>
      </div>

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        imamId={call?.state.createdBy?.id}
      />
    </section>
  );
}

export default LiveStreamRoom;

const CallLayouts = () => {
  const { useParticipants } = useCallStateHooks();
  const call = useCall();
  const participants = useParticipants();
  const callCreatorId = call?.state.createdBy?.id;

  const hostParticipant = participants.find((p) => p.userId === callCreatorId);
  const otherParticipants = participants.filter(
    (p) => p.sessionId !== hostParticipant?.sessionId,
  );

  return (
    <div className="relative size-full flex items-center justify-center">
      {/* Main Host Video */}
      <div className="w-full h-full rounded-2xl overflow-hidden bg-black relative shadow-2xl">
        {hostParticipant ? (
          <ParticipantView participant={hostParticipant} />
        ) : (
          <div className="flex items-center justify-center h-full flex-col gap-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold shadow-xl shadow-purple-500/20">
              {callCreatorId?.slice(0, 2).toUpperCase() || "H"}
            </div>
            <p className="text-gray-500 font-medium">Host video stream</p>
          </div>
        )}
      </div>

      {/* Floating Participant Thumbnails */}
      <div className="absolute top-6 right-6 flex flex-col gap-3">
        {otherParticipants.slice(0, 4).map((p) => (
          <div key={p.sessionId} className="group relative">
            <div className="w-16 h-16 rounded-2xl bg-[#1a1a1e] border-2 border-gray-800 overflow-hidden shadow-xl transition-transform hover:scale-110 cursor-pointer">
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.name}
                  className="size-full object-cover"
                  width={40}
                  height={40}
                />
              ) : (
                <div className="size-full flex items-center justify-center text-xs font-bold bg-gray-800">
                  {p.name?.slice(0, 2).toUpperCase() ||
                    p.userId.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            {/* Tooltip */}
            <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black/90 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10">
              {p.name || p.userId}
            </div>
          </div>
        ))}
        {otherParticipants.length > 4 && (
          <div className="w-16 h-16 rounded-2xl bg-gray-800/50 border-2 border-dashed border-gray-700 flex items-center justify-center text-xs font-bold text-gray-500">
            +{otherParticipants.length - 4}
          </div>
        )}
      </div>
    </div>
  );
};
