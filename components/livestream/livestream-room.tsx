"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import {
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
} from "@stream-io/video-react-sdk";
import { useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutList,
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
import { Card } from "@/components/ui/card";
import { getLiveEventById } from "@/app/(dashboards)/imam/events/action";
import { Event } from "@/types/events";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right" | "top";

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  isDonation?: boolean;
  amount?: number;
}

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonate: (amount: number, message: string) => void;
}

function DonationModal({ isOpen, onClose, onDonate }: DonationModalProps) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const donationAmount = Number.parseFloat(amount);
    if (donationAmount > 0) {
      onDonate(donationAmount, message);
      setAmount("");
      setMessage("");
      onClose();
    }
  };

  const quickAmounts = [5, 10, 25, 50];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-yellow-500" />
              <h3 className="text-xl font-semibold">Send Donation</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">
                Quick Amount
              </label>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant={
                      amount === quickAmount.toString() ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setAmount(quickAmount.toString())}
                    className="text-sm"
                  >
                    ${quickAmount}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Custom Amount ($)
              </label>
              <Input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="text-base h-11"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Message (Optional)
              </label>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message..."
                className="text-base h-11"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {message.length}/100 characters
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                disabled={!amount || Number.parseFloat(amount) <= 0}
              >
                <Gift className="w-4 h-4 mr-2" />
                Donate ${amount || "0"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

interface LiveStreamRoomProps {
  userRole?: "host" | "viewer";
}

function LiveStreamRoom({ userRole = "viewer" }: LiveStreamRoomProps) {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const [layout, setLayout] = useState<CallLayoutType>("top");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const call = useCall();
  const [event, setEvent] = useState<Event | null>(null);
  const { id } = useParams();

  console.log(id);

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
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
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

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      case "speaker-left":
        return <SpeakerLayout participantsBarPosition="right" />;
      default:
        return <SpeakerLayout participantsBarPosition="top" />;
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !call) return;

    await call.sendCustomEvent({
      type: "chat_message",
      custom: { message: newMessage.trim() },
    });

    setNewMessage("");
  };

  const sendDonation = async (amount: number, message: string) => {
    if (!call) return;

    // Here you would integrate with your payment processor
    // For demo purposes, we'll just send the event
    await call.sendCustomEvent({
      type: "donation",
      custom: { amount, message },
    });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gray-950">
      <div className="relative flex flex-col lg:flex-row size-full">
        {/* Main video area */}
        <div className="flex-1 flex items-center justify-center relative bg-gray-900 mb-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{event?.title}</h1>
            <p>{event?.description}</p>
          </div>
          <div className="flex py-6  size-full items-center justify-center">
            <CallLayout />
          </div>

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
                ref={chatContainerRef}
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
                      setShowDonationModal(true);
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
            ref={chatContainerRef}
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
                  setShowDonationModal(true);
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
          <DropdownMenu>
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
          </DropdownMenu>

          <CallStatsButton />

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
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        onDonate={sendDonation}
      />
    </section>
  );
}

export default LiveStreamRoom;
