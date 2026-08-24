"use client";
import { useState, useEffect } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";

export function LiveRoom({ room, identity, name, isTeacher }: { room: string; identity: string; name: string; isTeacher?: boolean }) {
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/livekit/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room, identity, name, isTeacher }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else {
          setToken(d.token);
          setUrl(d.url);
        }
      })
      .catch((e) => setError(String(e)));
  }, [room, identity, name, isTeacher]);

  if (error) return <div className="p-6 text-red-600">Hata: {error}</div>;
  if (!token || !url) return <div className="p-6">Odaya bağlanılıyor... ({room}) max 10 kişi</div>;

  return (
    <LiveKitRoom token={token} serverUrl={url} connect video audio data-lk-theme="default" style={{ height: "70vh" }}>
      <VideoConference />
    </LiveKitRoom>
  );
}
