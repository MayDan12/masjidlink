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
import {
  // LayoutList,
  Loader,
  MessageCircle,
  Send,
  DollarSign,
  X,
  Users,
  Gift,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import EndCallButton from "./endcallButton";
import CustomCallControls from "./custom-call-controls";
import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
import { getLiveEventById } from "@/app/(dashboards)/imam/events/action";
import { Event } from "@/types/events";
// import { Checkbox } from "../ui/checkbox";

import DonationModal from "./donationModal";

// type CallLayoutType = "grid" | "speaker-left" | "speaker-right" | "top";

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
  // const [layout, setLayout] = useState<CallLayoutType>("top");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  // const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatRefMobile = useRef<HTMLDivElement>(null);
  const chatRefDesktop = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const call = useCall();
  const [event, setEvent] = useState<Event | null>(null);
  const { id } = useParams();

  // console.log(id);

  // Ensure call is available before proceeding
  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      const res = await getLiveEventById({ eventId: id as string });

      if (res.status === "error") {
        console.error("Failed to load event:", res.message);
        setEvent(null);
        return;
      }

      setEvent(res.event); // ✅ store the event
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (event) console.log("Fetched event:", event);
  }, [event]);
  // Ensure viewers can't enable their devices even if they try
  useEffect(() => {
    if (userRole === "viewer" && call) {
      call.camera.disable();
      call.microphone.disable();

      // const unsubCam = call.camera.on("changed", () => call.camera.disable());
      // const unsubMic = call.microphone.on("changed", () =>
      //   call.microphone.disable()
      // );
      const enforceViewerRestrictions = async () => {
        await call.camera.disable();
        await call.microphone.disable();
      };

      // Enforce restrictions periodically
      const interval = setInterval(enforceViewerRestrictions, 1000);

      return () => clearInterval(interval);
    }
  }, [userRole, call]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    const refs = [chatRefMobile.current, chatRefDesktop.current];
    refs.forEach((ref) => {
      if (ref) ref.scrollTop = ref.scrollHeight;
    });
  }, [chatMessages]);

  // Listen for custom events (donations, messages)
  useEffect(() => {
    if (!call) return;

    const handleCustomEvent = (event: any) => {
      if (event.type === "chat_message") {
        const message: ChatMessage = {
          id: Date.now().toString(),
          user: event.user.name || event.user.id,
          message: event.custom.message,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, message]);
      } else if (event.type === "donation") {
        const donation: ChatMessage = {
          id: Date.now().toString(),
          user: event.user.name || event.user.id,
          message: event.custom.message || "",
          timestamp: new Date(),
          isDonation: true,
          amount: event.custom.amount,
        };
        setChatMessages((prev) => [...prev, donation]);
      }
    };

    call.on("custom", handleCustomEvent);

    return () => {
      call.off("custom", handleCustomEvent);
    };
  }, [call]);

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin w-8 h-8 text-blue-500" />
          <Button
            onClick={() => {
              if (userRole === "viewer") {
                router.push("/dashboard");
              } else {
                router.push("/imam/events");
              }
            }}
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
    <section className="relative h-screen w-full overflow-hidden bg-gray-950">
      <div className="relative flex flex-col lg:flex-row size-full">
        {/* Main video area */}
        <div className="flex-1 flex flex-col relative bg-gray-900 mb-16">
          {/* Title or Event Metadata */}
          {event && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg z-10 text-center">
              <h1 className="text-lg md:text-2xl font-bold text-white">
                {event.title}
              </h1>
            </div>
          )}

          {/* Live Video Layout */}
          <CallLayouts />

          {/* Mobile chat overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-black/80 backdrop-blur-sm z-20 lg:hidden transition-all duration-300",
              showChat ? "opacity-100 visible" : "opacity-0 invisible"
            )}
            onClick={() => setShowChat(false)}
          >
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl max-h-[75vh] flex flex-col shadow-2xl border-t border-gray-700 transition-transform duration-300",
                showChat ? "translate-y-0" : "translate-y-full"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile chat header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 rounded-t-3xl">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                  <h3 className="text-white font-semibold">Live Chat</h3>
                  <Badge variant="secondary" className="text-xs">
                    {chatMessages.length}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChat(false)}
                  className="text-white hover:bg-gray-700 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile chat messages */}
              <div
                ref={chatRefMobile}
                className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[45vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
              >
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                    <MessageCircle className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs">Be the first to say something!</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "p-3 rounded-xl transition-all duration-200 hover:scale-[1.02]",
                        msg.isDonation
                          ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-400/30 shadow-lg"
                          : "bg-gray-800/80 hover:bg-gray-800"
                      )}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                        <span className="text-sm font-semibold text-white truncate">
                          {msg.user}
                        </span>
                        <div className="flex items-center gap-2">
                          {msg.isDonation && (
                            <Badge className="bg-yellow-500 text-black text-xs font-bold">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {msg.amount}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-400">
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                      {msg.message && (
                        <p className="text-sm text-gray-200 break-words leading-relaxed">
                          {msg.message}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Mobile chat input */}
              <div className="p-4 border-t border-gray-700 bg-gray-800 space-y-3">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 border-gray-600 text-white text-base h-11 focus:ring-2 focus:ring-blue-500"
                    maxLength={200}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="px-4 h-11 bg-blue-600 hover:bg-blue-700"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                {userRole === "viewer" && (
                  <Button
                    onClick={() => {
                      setIsDonationModalOpen(true);
                      setShowChat(false);
                    }}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium h-11"
                    size="sm"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Send Donation
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop participants panel */}
        <div
          className={cn(
            "hidden lg:block lg:w-80 h-full border-l border-gray-700 bg-gray-900 transition-all duration-300",
            showParticipants ? "lg:block" : "lg:hidden"
          )}
          style={{ paddingBottom: "76px" }} // Add padding to account for control bar height
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>

        {/* Desktop chat panel */}
        <div
          className={cn(
            "hidden lg:flex lg:w-80 bg-gray-900 border-l border-gray-700 flex-col transition-all duration-300",
            showChat ? "lg:flex" : "lg:hidden"
          )}
          style={{ paddingBottom: "76px" }} // Add padding to account for control bar height
        >
          {/* Desktop chat header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gray-800">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-semibold">Live Chat</h3>
              <Badge variant="secondary" className="text-xs">
                {chatMessages.length}
              </Badge>
            </div>
          </div>

          {/* Desktop chat messages */}
          <div
            ref={chatRefDesktop}
            className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
            style={{ maxHeight: "calc(100vh - 190px)" }} // Account for header, input area and controls
          >
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <MessageCircle className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs">Be the first to say something!</p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "p-3 rounded-lg transition-all duration-200 hover:scale-[1.01]",
                    msg.isDonation
                      ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-400/30 shadow-lg"
                      : "bg-gray-800/80 hover:bg-gray-800"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-sm font-semibold text-white truncate">
                      {msg.user}
                    </span>
                    {msg.isDonation && (
                      <Badge className="bg-yellow-500 text-black text-xs font-bold">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {msg.amount}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {msg.message && (
                    <p className="text-sm text-gray-200 break-words leading-relaxed">
                      {msg.message}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Desktop chat input */}
          <div className="p-4 border-t border-gray-700 bg-gray-800 space-y-3">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                maxLength={200}
              />
              <Button
                type="submit"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!newMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            {userRole === "viewer" && (
              <Button
                onClick={() => {
                  setIsDonationModalOpen(true);
                  setShowChat(false);
                }}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium h-11"
                size="sm"
              >
                <Gift className="w-4 h-4 mr-2" />
                Send Donation
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile participants overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black/80 backdrop-blur-sm z-20 lg:hidden transition-all duration-300",
          showParticipants ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={() => setShowParticipants(false)}
      >
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-gray-900 shadow-2xl border-l py-4 border-gray-700 transition-transform duration-300",
            showParticipants ? "translate-x-0" : "translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      {/* Enhanced Responsive Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-700 shadow-2xl z-30">
        <div className="flex items-center justify-center gap-1 sm:gap-3 p-3 sm:p-4 overflow-x-auto">
          {/* Custom call controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            <CustomCallControls
              userRole={userRole}
              onLeave={() => {
                call?.leave();
              }}
            />
          </div>

          {/* Layout dropdown - enhanced for mobile */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 bg-gray-800 hover:bg-gray-700 border border-gray-600"
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-40">
              {[
                { label: "Grid", value: "grid" },
                { label: "Speaker Left", value: "speaker-left" },
                { label: "Speaker Right", value: "speaker-right" },
              ].map((item, index) => (
                <div key={index}>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      setLayout(item.value as CallLayoutType);
                    }}
                  >
                    {item.label}
                    {layout === item.value && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Active
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  {index < 2 && <DropdownMenuSeparator />}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}

          {/* <CallStatsButton /> */}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowParticipants((prev) => !prev)}
            className={cn(
              "h-10 w-10 p-0 border border-gray-600 transition-colors",
              showParticipants
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-800 hover:bg-gray-700"
            )}
          >
            <Users className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChat((prev) => !prev)}
            className={cn(
              "h-10 w-10 p-0 border border-gray-600 transition-colors relative",
              showChat
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-800 hover:bg-gray-700"
            )}
          >
            <MessageCircle className="w-4 h-4" />
            {chatMessages.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 border-2 border-gray-900">
                {chatMessages.length > 9 ? "9+" : chatMessages.length}
              </Badge>
            )}
          </Button>

          {!isPersonalRoom && userRole === "host" && <EndCallButton />}
        </div>
      </div>

      {/* Enhanced Donation Modal */}
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
    (p) => p.sessionId !== hostParticipant?.sessionId
  );

  return (
    <div className="flex flex-col lg:flex-row w-full h-full gap-4 p-2">
      {/* Host's large video */}
      <div className="flex-1 bg-black rounded-xl overflow-hidden flex items-center justify-center">
        {hostParticipant ? (
          <ParticipantView participant={hostParticipant} />
        ) : (
          <p className="text-white">Host not available</p>
        )}
      </div>

      {/* Small participant thumbnails */}
      <div className="flex lg:flex-col gap-2 overflow-auto max-h-full">
        {otherParticipants.map((p) => (
          <div
            key={p.sessionId}
            className="w-28 h-20 bg-gray-800 rounded-lg overflow-hidden"
          >
            <ParticipantView participant={p} />
          </div>
        ))}
      </div>
    </div>
  );
};
