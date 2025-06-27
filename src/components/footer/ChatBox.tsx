import React, { useState, useEffect, useRef } from "react";
import { Drawer, Input, Button, message } from "antd";
import { jwtDecode } from "jwt-decode";
import { ChatBoxProps, Message } from "../../types";
const { TextArea } = Input;
import Pusher from "pusher-js";
import { PUSHER_KEY, PUSHER_CLUSTER, API } from "../../data/constants";
import "./chatBox.css";

const ChatBox: React.FC<ChatBoxProps> = ({ open, onClose }) => {
  const [token, setToken] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("chat_token");
    const savedUserId = localStorage.getItem("chat_userId");
    if (savedToken && savedUserId) {
      setToken(savedToken);
      setUserId(savedUserId);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const { exp } = jwtDecode<{ exp: number }>(token);

    const msUntilExpiry = exp * 1000 - Date.now();

    if (msUntilExpiry <= 0) {
      logout();
      return;
    }

    // 4) Otherwise schedule exactly one timeout for that moment
    const timer = window.setTimeout(logout, msUntilExpiry);

    // 5) Clean up on unmount or if token changes
    return () => window.clearTimeout(timer);
  });

  useEffect(() => {
    if (!token) return;

    (async () => {
      const res = await fetch(`${API}/chat/history`, {
        headers: { Authorization: "Bearer " + token },
      });
      if (res.status === 401) {
        logout();
        return;
      }
      const hist: Message[] = await res.json();
      setMsgs(hist);
    })();

    const p = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      authEndpoint: `${API}/chat/pusher/auth`,
      auth: { headers: { Authorization: "Bearer " + token } },
    });

    const channel = p.subscribe("presence-chat");
    channel.bind("message", (m: Message) => setMsgs((ms) => [...ms, m]));

    return () => p.disconnect();
  }, [token]);

  const logout = () => {
    localStorage.removeItem("chat_token");
    localStorage.removeItem("chat_userId");
    setToken(null);
    setUserId(null);
    setMsgs([]);
  };

  const sendOrLogin = async () => {
    if (!draft.trim()) return;

    if (!token) {
      try {
        const res = await fetch(`${API}/chat/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: draft }),
        });

        if (res.status === 401) {
          message.error("Wrong.");
          return;
        }

        if (!res.ok) throw new Error("Invalid code");
        const { token: newToken, userId: id } = await res.json();
        localStorage.setItem("chat_token", newToken);
        localStorage.setItem("chat_userId", id);
        setToken(newToken);
        setUserId(id);
        setDraft("");
      } catch (err: any) {
        message.error("Wrong lock code");
        console.error(err);
      }
      return;
    }

    try {
      const res = await fetch(`${API}/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ text: draft }),
      });

      if (!res.ok) {
        throw new Error(`Send failed: ${res.statusText}`);
      }

      setDraft("");
    } catch (err: any) {
      console.error("Chat send error", err);
    }
  };

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgs, open]);

  return (
    <Drawer
      title={<div className="drawer-title">CHAT</div>}
      placement="bottom"
      closable={false}
      onClose={onClose}
      open={open}
      height={500}
      className="chat-box"
      footer={
        <div
          style={{ display: "flex", padding: 8, borderTop: "1px solid #eee" }}
        >
          <TextArea
            className="text-input"
            autoSize={{ minRows: 1, maxRows: 6 }}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendOrLogin();
              }
            }}
            placeholder={token ? "Type a message…" : "Enter secret code"}
          />
          {!token && (
            <Button
              className="send-btn"
              onClick={sendOrLogin}
              disabled={!draft.trim()}
            >
              Login
            </Button>
          )}

          {token && (
            <Button
              className="send-btn"
              type="primary"
              onClick={sendOrLogin}
              disabled={!token}
            >
              Send
            </Button>
          )}
        </div>
      }
      styles={{
        mask: { backgroundColor: "transparent" },
        wrapper: {
          width: 300,
          margin: "0 auto",
          maxWidth: "100%",
          borderRadius: "12px 12px 12px 12px",
          overflow: "hidden",
        },
        header: {
          background:
            "linear-gradient(to right, #ababab 0%, #ababab 45%, #000000 100%)",
          height: "50px",
        },
        content: {
          display: "flex",
          flexDirection: "column",
          padding: 0,
          height: "100%",
        },
        body: {
          flex: "1 1 auto",
          overflowY: "visible",
          padding: "16px",
        },
      }}
      afterOpenChange={(visible) => {
        if (visible) {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }}
    >
      {token ? (
        <div className="messages-container">
          {msgs.map((m, i) => {
            const isMine = m.userId === userId;
            return (
              <div
                key={i}
                style={{ marginTop: "5px", marginBottom: "5px" }}
                className={`
                chat-message
                ${isMine ? "chat-message-outgoing" : "chat-message-incoming"}
            `}
              >
                <div className="chat-message-bubble">
                  <span className="chat-message-author">{m.name}</span>
                  <div className="chat-message-text">{m.text}</div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            color: "#666",
          }}
        >
          Please log in to continue.
        </div>
      )}
    </Drawer>
  );
};

export default ChatBox;
