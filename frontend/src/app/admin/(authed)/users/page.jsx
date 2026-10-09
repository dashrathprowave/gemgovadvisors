"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminAPI } from "@/lib/admin/api";

function fmtTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

export default function Users() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: AdminAPI.users,
  });
  const { data: convs } = useQuery({
    queryKey: ["conversations"],
    queryFn: AdminAPI.conversations,
  });
  const [expanded, setExpanded] = useState(null);

  // Group conversations by visitor session
  const bySession = {};
  for (const c of (convs || [])) {
    if (!c.session_id) continue;
    (bySession[c.session_id] = bySession[c.session_id] || []).push(c);
  }

  return (
    <div>
      <h1>Users</h1>
      <p className="page-desc">
        Leads captured from the chat widget — names &amp; mobile numbers for the sales team to follow up.
        Expand a row to see what conversations each user had and when.
      </p>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Q count</th>
              <th>Conversations</th>
              <th>Registered</th>
              <th>Last seen</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={6} className="empty">Loading…</td></tr>
            )}
            {error && (
              <tr><td colSpan={6} className="empty error">{error.message}</td></tr>
            )}
            {!isLoading && !error && data?.length === 0 && (
              <tr><td colSpan={6} className="empty">No leads yet. Ask visitors to open the chat widget.</td></tr>
            )}
            {data?.map((u) => {
              const chats = bySession[u.session_id] || [];
              const isOpen = expanded === u.id;
              return [
                <tr key={u.id}>
                  <td className="table-text">{u.name}</td>
                  <td>
                    <a href={`tel:${u.phone}`} className="table-link">{u.phone}</a>
                  </td>
                  <td>{u.message_count}</td>
                  <td>
                    {chats.length > 0 ? (
                      <button
                        className="ghost"
                        onClick={() => setExpanded(isOpen ? null : u.id)}
                        title={isOpen ? "Hide conversations" : "Show conversations"}
                      >
                        {isOpen ? "▾" : "▸"} {chats.length} chat{chats.length === 1 ? "" : "s"}
                      </button>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>{u.created_at ? new Date(u.created_at).toLocaleString() : "—"}</td>
                  <td>{u.last_seen ? new Date(u.last_seen).toLocaleString() : "—"}</td>
                </tr>,
                isOpen && (
                  <tr key={`${u.id}-chats`}>
                    <td colSpan={6}>
                      <div className="user-chats">
                        {chats.map((c) => (
                          <div key={c.id} className="user-chat">
                            <div className="user-chat-time">
                              🕒 Started: <strong>{fmtTime(c.created_at)}</strong>
                              {c.last_message_at && c.last_message_at !== c.created_at && (
                                <span> · Last activity: <strong>{fmtTime(c.last_message_at)}</strong></span>
                              )}
                              <span className="pill" style={{ marginLeft: 8 }}>
                                {c.question_count} question{c.question_count === 1 ? "" : "s"}
                              </span>
                            </div>
                            {c.first_question && (
                              <div className="user-chat-q">“{c.first_question}”</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ),
              ];
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
