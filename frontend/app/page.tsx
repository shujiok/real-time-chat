"use client";

import * as Avatar from "@radix-ui/react-avatar";
import { Client } from "@stomp/stompjs";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import SockJS from "sockjs-client";

type Message = {
  sender: string;
  content: string;
  timestamp?: string;
};

const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:8000/ws-chat";

export default function Home() {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const [sender, setSender] = useState("guest");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const statusText = useMemo(() => (connected ? "Connected" : "Disconnected"), [connected]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 3000,
    });

    client.onConnect = () => {
      setConnected(true);
      client.subscribe("/topic/messages", (frame) => {
        const payload = JSON.parse(frame.body) as Message;
        setMessages((prev) => [...prev, payload]);
      });
    };

    client.onStompError = () => {
      setConnected(false);
    };

    client.onWebSocketClose = () => {
      setConnected(false);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
      setConnected(false);
    };
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!clientRef.current?.connected || !message.trim() || !sender.trim()) {
      return;
    }

    clientRef.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({ sender, content: message.trim() }),
    });
    setMessage("");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between rounded-xl border border-zinc-200 p-4">
        <h1 className="text-xl font-semibold">Real-time Chat</h1>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            connected ? "bg-green-100 text-green-800" : "bg-zinc-100 text-zinc-700"
          }`}
        >
          {statusText}
        </span>
      </header>

      <section className="flex-1 rounded-xl border border-zinc-200 bg-white p-4">
        <ul className="space-y-3">
          {messages.map((item, index) => (
            <li
              key={`${item.sender}-${item.timestamp ?? index}`}
              className="flex items-start gap-3"
            >
              <Avatar.Root className="inline-flex h-8 w-8 select-none items-center justify-center overflow-hidden rounded-full bg-zinc-100 align-middle">
                <Avatar.Fallback className="text-xs font-medium text-zinc-700">
                  {item.sender.slice(0, 2).toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>
              <div>
                <p className="text-sm font-medium text-zinc-900">{item.sender}</p>
                <p className="text-sm text-zinc-700">{item.content}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <form className="grid gap-3 rounded-xl border border-zinc-200 p-4" onSubmit={onSubmit}>
        <label className="grid gap-1 text-sm">
          Name
          <input
            className="rounded-md border border-zinc-300 px-3 py-2"
            value={sender}
            onChange={(event) => setSender(event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Message
          <input
            className="rounded-md border border-zinc-300 px-3 py-2"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!connected}
        >
          Send
        </button>
      </form>
    </main>
  );
}
