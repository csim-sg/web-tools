'use client';
import { useState } from 'react';
import Image from 'next/image';

interface Counter {
  type: 'poison' | 'commander' | 'energy' | 'experience';
  count: number;
  icon: string;
}

interface Player {
  id: number;
  life: number;
  name: string;
  counters: Counter[];
  commanderDamage?: { [key: number]: number }; // Track commander damage from other players
}

interface GameSettings {
  mode: 'normal' | 'commander';
  startingLife: number;
}

const COUNTER_TYPES = {
  poison: {
    name: 'Poison',
    icon: '/mtg/poison.svg',
    initial: 0,
  },
  energy: {
    name: 'Energy',
    icon: '/mtg/energy.svg',
    initial: 0,
  },
  experience: {
    name: 'Experience',
    icon: '/mtg/experience.svg',
    initial: 0,
  },
  commander: {
    name: 'Commander',
    icon: '/mtg/commander.svg',
    initial: 0,
  },
};

const DEFAULT_SETTINGS = {
  normal: {
    startingLife: 20,
    showCommanderDamage: false,
  },
  commander: {
    startingLife: 40,
    showCommanderDamage: true,
  },
};

export default function MTGLifeCounter() {
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'normal',
    startingLife: DEFAULT_SETTINGS.normal.startingLife,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState<Player[]>(
    Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      life: settings.startingLife,
      name: `Player ${i + 1}`,
      counters: Object.keys(COUNTER_TYPES).map(type => ({
        type: type as keyof typeof COUNTER_TYPES,
        count: COUNTER_TYPES[type as keyof typeof COUNTER_TYPES].initial,
        icon: COUNTER_TYPES[type as keyof typeof COUNTER_TYPES].icon,
      })),
      commanderDamage: {},
    }))
  );
  const [monarchPlayer, setMonarchPlayer] = useState<number | null>(null);

  const updateLife = (playerId: number, change: number) => {
    setPlayers(players.map(player =>
      player.id === playerId
        ? { ...player, life: player.life + change }
        : player
    ));
  };

  const updateCounter = (playerId: number, counterType: string, change: number) => {
    setPlayers(players.map(player =>
      player.id === playerId
        ? {
            ...player,
            counters: player.counters.map(counter =>
              counter.type === counterType
                ? { ...counter, count: Math.max(0, counter.count + change) }
                : counter
            ),
          }
        : player
    ));
  };

  const updateCommanderDamage = (fromPlayerId: number, toPlayerId: number, change: number) => {
    setPlayers(players.map(player =>
      player.id === toPlayerId
        ? {
            ...player,
            commanderDamage: {
              ...player.commanderDamage,
              [fromPlayerId]: Math.max(0, (player.commanderDamage?.[fromPlayerId] || 0) + change),
            },
          }
        : player
    ));
  };

  const resetGame = () => {
    setPlayers(players.map(player => ({
      ...player,
      life: settings.startingLife,
      counters: player.counters.map(counter => ({
        ...counter,
        count: COUNTER_TYPES[counter.type].initial,
      })),
      commanderDamage: {},
    })));
  };

  const changeGameMode = (mode: 'normal' | 'commander') => {
    const newSettings = {
      mode,
      startingLife: DEFAULT_SETTINGS[mode].startingLife,
    };
    setSettings(newSettings);
    setPlayers(players.map(player => ({
      ...player,
      life: newSettings.startingLife,
      commanderDamage: {},
    })));
  };

  const MonarchToken = () => {
    if (monarchPlayer === null) return null;
    
    return (
      <div className="fixed top-4 right-4 bg-yellow-100 border-2 border-yellow-500 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <Image
            src="/mtg/monarch.svg"
            alt="Monarch"
            width={24}
            height={24}
            className="text-yellow-600"
          />
          <span className="font-semibold text-yellow-800">
            {players[monarchPlayer - 1]?.name} is the Monarch
          </span>
        </div>
      </div>
    );
  };

  const setNewMonarch = (playerId: number) => {
    setMonarchPlayer(playerId);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <MonarchToken />

        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">MTG Life Counter</h1>
          
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Settings
            </button>
            <select
              value={playerCount}
              onChange={(e) => setPlayerCount(Number(e.target.value))}
              className="px-3 py-2 border rounded-lg"
            >
              {[2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} Players</option>
              ))}
            </select>
            <button
              onClick={resetGame}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Reset Game
            </button>
          </div>
        </div>

        {isSettingsOpen && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Game Settings</h2>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Game Mode</label>
                <select
                  value={settings.mode}
                  onChange={(e) => changeGameMode(e.target.value as 'normal' | 'commander')}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="normal">Normal</option>
                  <option value="commander">Commander</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Starting Life</label>
                <input
                  type="number"
                  value={settings.startingLife}
                  onChange={(e) => {
                    const newLife = parseInt(e.target.value);
                    setSettings({ ...settings, startingLife: newLife });
                  }}
                  className="px-3 py-2 border rounded-lg w-24"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Monarch</h3>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setMonarchPlayer(null)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Clear Monarch
                </button>
                {players.slice(0, playerCount).map(player => (
                  <button
                    key={player.id}
                    onClick={() => setNewMonarch(player.id)}
                    className={`px-3 py-1 rounded ${
                      monarchPlayer === player.id
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {player.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.slice(0, playerCount).map(player => (
            <div
              key={player.id}
              className={`border rounded-lg p-6 bg-white shadow-lg relative ${
                monarchPlayer === player.id ? 'ring-2 ring-yellow-500' : ''
              }`}
            >
              {monarchPlayer === player.id && (
                <div className="absolute top-2 right-2">
                  <Image
                    src="/mtg/monarch.svg"
                    alt="Monarch"
                    width={24}
                    height={24}
                    className="text-yellow-600"
                  />
                </div>
              )}

              <h2 className="text-xl font-semibold mb-4 text-center">{player.name}</h2>
              
              <div className="text-6xl font-bold mb-6 text-center">{player.life}</div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => updateLife(player.id, -1)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  -1
                </button>
                <button
                  onClick={() => updateLife(player.id, 1)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  +1
                </button>
                <button
                  onClick={() => updateLife(player.id, -5)}
                  className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
                >
                  -5
                </button>
                <button
                  onClick={() => updateLife(player.id, 5)}
                  className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                >
                  +5
                </button>
              </div>

              <div className="space-y-2">
                {player.counters.map(counter => (
                  <div key={counter.type} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <Image
                      src={counter.icon}
                      alt={counter.type}
                      width={20}
                      height={20}
                    />
                    <span className="flex-grow capitalize">{counter.type}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => updateCounter(player.id, counter.type, -1)}
                        className="bg-red-100 text-red-600 w-8 h-8 rounded hover:bg-red-200"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{counter.count}</span>
                      <button
                        onClick={() => updateCounter(player.id, counter.type, 1)}
                        className="bg-green-100 text-green-600 w-8 h-8 rounded hover:bg-green-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                {settings.mode === 'commander' && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Commander Damage</h3>
                    <div className="space-y-2">
                      {players
                        .slice(0, playerCount)
                        .filter(p => p.id !== player.id)
                        .map(otherPlayer => (
                          <div key={otherPlayer.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                            <span className="flex-grow">From {otherPlayer.name}</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => updateCommanderDamage(otherPlayer.id, player.id, -1)}
                                className="bg-red-100 text-red-600 w-8 h-8 rounded hover:bg-red-200"
                              >
                                -
                              </button>
                              <span className="w-8 text-center">
                                {player.commanderDamage?.[otherPlayer.id] || 0}
                              </span>
                              <button
                                onClick={() => updateCommanderDamage(otherPlayer.id, player.id, 1)}
                                className="bg-green-100 text-green-600 w-8 h-8 rounded hover:bg-green-200"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 bg-blue-50 p-2 rounded">
                  <Image
                    src="/mtg/energy.svg"
                    alt="Energy"
                    width={20}
                    height={20}
                    className="text-blue-600"
                  />
                  <span className="flex-grow">Energy</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => updateCounter(player.id, 'energy', -1)}
                      className="bg-blue-100 text-blue-600 w-8 h-8 rounded hover:bg-blue-200"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">
                      {player.counters.find(c => c.type === 'energy')?.count || 0}
                    </span>
                    <button
                      onClick={() => updateCounter(player.id, 'energy', 1)}
                      className="bg-blue-100 text-blue-600 w-8 h-8 rounded hover:bg-blue-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-purple-50 p-2 rounded">
                  <Image
                    src="/mtg/experience.svg"
                    alt="Experience"
                    width={20}
                    height={20}
                    className="text-purple-600"
                  />
                  <span className="flex-grow">Experience</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => updateCounter(player.id, 'experience', -1)}
                      className="bg-purple-100 text-purple-600 w-8 h-8 rounded hover:bg-purple-200"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">
                      {player.counters.find(c => c.type === 'experience')?.count || 0}
                    </span>
                    <button
                      onClick={() => updateCounter(player.id, 'experience', 1)}
                      className="bg-purple-100 text-purple-600 w-8 h-8 rounded hover:bg-purple-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 