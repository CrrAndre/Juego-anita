(() => {
  const config = window.SHELF_SUPABASE_CONFIG || {};
  const hasConfig = Boolean(config.url && config.anonKey && window.supabase?.createClient);
  const client = hasConfig ? window.supabase.createClient(config.url, config.anonKey) : null;

  async function joinRoom(code, displayName, avatarInitials) {
    if (!client) return { mode: "local" };
    const { data, error } = await client.rpc("join_room", {
      p_code: code,
      p_display_name: displayName,
      p_avatar_initials: avatarInitials
    });
    if (error) throw new Error(error.message);
    const membership = Array.isArray(data) ? data[0] : data;
    if (!membership?.room_id || !membership?.player_id) {
      throw new Error("La sala no devolvió una membresía válida.");
    }
    return { mode: "remote", ...membership };
  }

  async function loadPlayers(roomId) {
    if (!client) return [];
    const { data, error } = await client
      .from("players")
      .select("id, display_name, avatar_initials, total_points, average_response_ms")
      .eq("room_id", roomId)
      .order("total_points", { ascending: false })
      .order("joined_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
  }

  function subscribePlayers(roomId, onChange) {
    if (!client) return null;
    return client
      .channel(`room-players-${roomId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "players",
        filter: `room_id=eq.${roomId}`
      }, onChange)
      .subscribe();
  }

  window.ShelfBackend = {
    isConfigured: hasConfig,
    joinRoom,
    loadPlayers,
    subscribePlayers
  };
})();
