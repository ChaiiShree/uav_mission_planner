import { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Plug, PlugZap, Trash2, Download, Settings } from 'lucide-react';

interface SerialMonitorProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface SerialLine {
  timestamp: string;
  message: string;
  type: 'input' | 'output' | 'system';
}

export const SerialMonitor = ({ isOpen, onToggle }: SerialMonitorProps) => {
  const [port, setPort] = useState<SerialPort | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [serialLines, setSerialLines] = useState<SerialLine[]>([]);
  const [input, setInput] = useState('');
  const [baudRate, setBaudRate] = useState(115200);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filter, setFilter] = useState('');
  const [showTimestamps, setShowTimestamps] = useState(true);
  const outputRef = useRef<HTMLDivElement>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<string> | null>(null);

  const baudRates = [9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600];

  const connectSerial = async () => {
    try {
      if (!('serial' in navigator)) {
        addSystemMessage('❌ Web Serial API not supported. Use Chrome/Edge browser.');
        return;
      }

      const selectedPort = await navigator.serial.requestPort({
        filters: [
          { usbVendorId: 0x10C4, usbProductId: 0xEA60 }, // CP2102
          { usbVendorId: 0x1A86, usbProductId: 0x7523 }, // CH340
          { usbVendorId: 0x0403, usbProductId: 0x6001 }, // FTDI
          { usbVendorId: 0x1A86, usbProductId: 0x55D4 }, // CH9102
        ]
      });

      await selectedPort.open({ 
        baudRate,
        dataBits: 8,
        stopBits: 1,
        parity: 'none'
      });

      setPort(selectedPort);
      setIsConnected(true);
      
      const portInfo = selectedPort.getInfo();
      addSystemMessage(`🔌 Connected to ESP32 (${portInfo.usbVendorId?.toString(16)}:${portInfo.usbProductId?.toString(16)}) @ ${baudRate} baud`);
      
      // Start reading
      startReading(selectedPort);
    } catch (error) {
      addSystemMessage(`❌ Connection failed: ${(error as Error).message}`);
    }
  };

  const disconnectSerial = async () => {
    try {
      if (readerRef.current) {
        await readerRef.current.cancel();
        readerRef.current = null;
      }
      
      if (port) {
        await port.close();
        setPort(null);
        setIsConnected(false);
        addSystemMessage('🔌 Disconnected from ESP32');
      }
    } catch (error) {
      addSystemMessage(`❌ Disconnect error: ${(error as Error).message}`);
    }
  };

  const startReading = async (serialPort: SerialPort) => {
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = serialPort.readable!.pipeTo(textDecoder.writable);
    readerRef.current = textDecoder.readable.getReader();

    try {
      while (true) {
        const { value, done } = await readerRef.current.read();
        if (done) break;
        
        // Process incoming data line by line
        const lines = value.split(/\r?\n/);
        lines.forEach(line => {
          const trimmedLine = line.trim();
          if (trimmedLine) {
            addOutputMessage(trimmedLine);
          }
        });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        addSystemMessage(`❌ Read error: ${(error as Error).message}`);
      }
    } finally {
      if (readerRef.current) {
        readerRef.current.releaseLock();
      }
    }
  };

  const sendCommand = async () => {
    if (port && isConnected && input.trim()) {
      try {
        const textEncoder = new TextEncoderStream();
        const writableStreamClosed = textEncoder.readable.pipeTo(port.writable!);
        const writer = textEncoder.writable.getWriter();
        
        await writer.write(input + '\r\n');
        addInputMessage(input);
        setInput('');
        
        await writer.close();
      } catch (error) {
        addSystemMessage(`❌ Send error: ${(error as Error).message}`);
      }
    }
  };

  const addSystemMessage = (message: string) => {
    const newLine: SerialLine = {
      timestamp: new Date().toLocaleTimeString(),
      message,
      type: 'system'
    };
    setSerialLines(prev => [...prev, newLine]);
  };

  const addOutputMessage = (message: string) => {
    const newLine: SerialLine = {
      timestamp: new Date().toLocaleTimeString(),
      message,
      type: 'output'
    };
    setSerialLines(prev => [...prev, newLine]);
  };

  const addInputMessage = (message: string) => {
    const newLine: SerialLine = {
      timestamp: new Date().toLocaleTimeString(),
      message: `> ${message}`,
      type: 'input'
    };
    setSerialLines(prev => [...prev, newLine]);
  };

  const clearOutput = () => {
    setSerialLines([]);
    addSystemMessage('🗑️ Output cleared');
  };

  const saveLog = () => {
    const logContent = serialLines
      .map(line => `${showTimestamps ? `[${line.timestamp}] ` : ''}${line.message}`)
      .join('\n');
    
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `esp32_serial_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (autoScroll && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [serialLines, autoScroll]);

  // Filter messages
  const filteredLines = serialLines.filter(line =>
    filter ? line.message.toLowerCase().includes(filter.toLowerCase()) : true
  );

  const getLineColor = (type: SerialLine['type']) => {
    switch (type) {
      case 'input': return 'text-blue-400';
      case 'system': return 'text-yellow-400';
      case 'output': return 'text-green-400';
      default: return 'text-green-400';
    }
  };

  // Quick command buttons
  const quickCommands = [
    { label: 'STATUS', command: 'STATUS' },
    { label: 'CALIBRATE', command: 'CALIBRATE' },
    { label: 'ARM', command: 'ARM' },
    { label: 'DISARM', command: 'DISARM' },
    { label: 'RESTART', command: 'RESTART' }
  ];

  const sendQuickCommand = (command: string) => {
    setInput(command);
    setTimeout(() => sendCommand(), 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t-2 border-green-500 z-50 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <Terminal className="text-green-400" size={20} />
          <h3 className="text-green-400 font-mono font-bold">ESP32 SERIAL MONITOR</h3>
          <div className={`w-3 h-3 rounded-full animate-pulse ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-400 font-mono">
            {isConnected ? `${baudRate} BAUD` : 'DISCONNECTED'}
          </span>
          <span className="text-xs text-gray-500 font-mono">
            Lines: {serialLines.length}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Baud Rate Selector */}
          <select 
            value={baudRate} 
            onChange={(e) => setBaudRate(Number(e.target.value))}
            className="bg-gray-700 text-green-400 text-xs p-1 rounded font-mono border border-gray-600"
            disabled={isConnected}
          >
            {baudRates.map(rate => (
              <option key={rate} value={rate}>{rate}</option>
            ))}
          </select>

          {/* Tools */}
          <button
            onClick={clearOutput}
            className="px-2 py-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
            title="Clear Output"
          >
            <Trash2 size={14} />
          </button>

          <button
            onClick={saveLog}
            className="px-2 py-1 text-xs text-gray-400 hover:text-blue-400 transition-colors"
            title="Save Log"
          >
            <Download size={14} />
          </button>

          {/* Connect/Disconnect */}
          <button
            onClick={isConnected ? disconnectSerial : connectSerial}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
              isConnected 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isConnected ? (
              <><PlugZap size={12} className="inline mr-1" />DISCONNECT</>
            ) : (
              <><Plug size={12} className="inline mr-1" />CONNECT</>
            )}
          </button>
          
          <button
            onClick={onToggle}
            className="px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
        {/* Filter */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter messages..."
            className="px-2 py-1 bg-gray-900 text-green-400 font-mono text-xs border border-gray-600 rounded w-40 focus:outline-none focus:border-green-500"
          />
          <label className="flex items-center text-xs text-gray-400">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="mr-1"
            />
            Auto-scroll
          </label>
          <label className="flex items-center text-xs text-gray-400">
            <input
              type="checkbox"
              checked={showTimestamps}
              onChange={(e) => setShowTimestamps(e.target.checked)}
              className="mr-1"
            />
            Timestamps
          </label>
        </div>

        {/* Quick Commands */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 mr-2">Quick:</span>
          {quickCommands.map(({ label, command }) => (
            <button
              key={command}
              onClick={() => sendQuickCommand(command)}
              disabled={!isConnected}
              className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80 flex flex-col">
        {/* Output Area */}
        <div 
          ref={outputRef}
          className="flex-1 p-3 bg-black font-mono text-xs overflow-y-auto"
          style={{ 
            fontFamily: 'Consolas, "Courier New", monospace',
            lineHeight: '1.4'
          }}
        >
          {filteredLines.length === 0 ? (
            <div className="text-gray-600 text-center py-8">
              {serialLines.length === 0 
                ? '🔌 Connect to ESP32 to view serial output' 
                : '🔍 No messages match filter'}
            </div>
          ) : (
            filteredLines.map((line, idx) => (
              <div 
                key={idx} 
                className={`whitespace-pre-wrap break-words ${getLineColor(line.type)}`}
              >
                {showTimestamps && <span className="text-gray-600">[{line.timestamp}] </span>}
                {line.message}
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="flex p-2 bg-gray-800 border-t border-gray-700">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendCommand();
              }
            }}
            placeholder={isConnected ? "Enter command and press Enter..." : "Connect to ESP32 first"}
            className="flex-1 px-3 py-2 bg-gray-900 text-green-400 font-mono text-sm border border-gray-600 rounded-l focus:outline-none focus:border-green-500 placeholder-gray-600"
            disabled={!isConnected}
          />
          <button
            onClick={sendCommand}
            disabled={!isConnected || !input.trim()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-mono text-sm rounded-r transition-colors flex items-center gap-1"
          >
            <Send size={14} />
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};
