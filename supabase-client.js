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

  async function createRoom(displayName, avatarInitials) {
    if (!client) {
      const code = `LOCAL-${Math.floor(10 + Math.random() * 90)}`;
      return { mode: "local", room_code: code };
    }
    const { data, error } = await client.rpc("create_room", {
      p_display_name: displayName,
      p_avatar_initials: avatarInitials
    });
    if (error) throw new Error(error.message);
    const membership = Array.isArray(data) ? data[0] : data;
    if (!membership?.room_id || !membership?.player_id || !membership?.room_code) {
      throw new Error("La sala no devolvió un código válido.");
    }
    return { mode: "remote", ...membership };
  }

  async function loadPlayers(roomId) {
    if (!client) return [];
    const { data, error } = await client
      .from("players")
      .select("id, display_name, avatar_initials, total_points, correct_answers, average_response_ms")
      .eq("room_id", roomId)
      .order("total_points", { ascending: false })
      .order("joined_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
  }

  async function loadRoom(roomId) {
    if (!client) return { status: "waiting" };
    const { data, error } = await client
      .from("rooms")
      .select("id, status, current_round, total_rounds")
      .eq("id", roomId)
      .single();
    if (error) throw new Error(error.message);
    return data;
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

  async function startRoom(roomId) {
    if (!client) return { mode: "local" };
    const { data, error } = await client.rpc("start_room", { p_room_id: roomId });
    if (error) throw new Error(error.message);
    return { mode: "remote", ...(Array.isArray(data) ? data[0] : data) };
  }

  async function recordPlayerResult(playerId, responseMs, isCorrect) {
    if (!client || !playerId) return;
    const { error } = await client.rpc("record_player_result", {
      p_player_id: playerId,
      p_response_ms: responseMs,
      p_is_correct: isCorrect
    });
    if (error) throw new Error(error.message);
  }

  function subscribeRoom(roomId, onChange) {
    if (!client) return null;
    return client
      .channel(`room-state-${roomId}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "rooms",
        filter: `id=eq.${roomId}`
      }, onChange)
      .subscribe();
  }

  window.ShelfBackend = {
    isConfigured: hasConfig,
    joinRoom,
    createRoom,
    startRoom,
    recordPlayerResult,
    loadRoom,
    loadPlayers,
    subscribePlayers,
    subscribeRoom
  };
})();
