function main(params) {
  if (!params || !params.proxies || !params["proxy-groups"]) return params;

  const SOCKS_NODE_NAME = "🧦 Socks5 Config";
  const RELAY_ENTRY_NAME = "RELAY_ENTRY";
  const OUTSIDE_RELAY_NAME = "OUTSIDE_RELAY";

  // 1. 添加自定义 Socks5 节点
  const customNode = {
    name: SOCKS_NODE_NAME,
    type: "socks5",
    server: "45.195.244.191",
    port: 7777,
    username: "linuxclash",
    password: "Linyu123",
  };
  if (!params.proxies.some(p => p.name === SOCKS_NODE_NAME)) {
    params.proxies.unshift(customNode);
  }

  // 2. 选出所有含港/台/新/日/美的节点用于中继入口
  const relayEntryNodes = params.proxies
    .filter(p => /🇭🇰|🇨🇳|🇸🇬|🇯🇵|🇺🇲|香港|台湾|新加坡|日本|美国/.test(p.name))
    .map(p => p.name);

  // 3. 添加策略组 RELAY_ENTRY
  const relayEntryGroup = {
    name: RELAY_ENTRY_NAME,
    type: "select",
    proxies: relayEntryNodes,
  };
  if (!params["proxy-groups"].some(g => g.name === RELAY_ENTRY_NAME)) {
    params["proxy-groups"].unshift(relayEntryGroup);
  }

  // 4. 添加策略组 OUTSIDE_RELAY
  const outsideRelayGroup = {
    name: OUTSIDE_RELAY_NAME,
    type: "relay",
    proxies: [RELAY_ENTRY_NAME, SOCKS_NODE_NAME],
  };
  if (!params["proxy-groups"].some(g => g.name === OUTSIDE_RELAY_NAME)) {
    params["proxy-groups"].unshift(outsideRelayGroup);
  }

  // 5. 为所有策略组添加 OUTSIDE_RELAY 为可选项（如果未包含）
  params["proxy-groups"] = params["proxy-groups"].map(group => {
    if (!Array.isArray(group.proxies)) return group;
    if (!group.proxies.includes(OUTSIDE_RELAY_NAME)) {
      group.proxies.unshift(OUTSIDE_RELAY_NAME);
    }
    return group;
  });

  return params;
}
