import React, { useState } from 'react';
import { 
  BarChart3, 
  Wallet, 
  ArrowRightLeft, 
  Settings, 
  Bell, 
  Search, 
  Menu,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BrainCircuit,
  ArrowRight,
  Server,
  ShieldAlert,
  Network,
  Database,
  UploadCloud,
  Zap,
  Info
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { wallets, forecastData, aiAlerts, formatCurrency, AIAlert } from './data/mockData';
import { cn } from './utils/cn';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AIAlert | null>(null);
  const [resolvedAlerts, setResolvedAlerts] = useState<Set<string>>(new Set());

  const handleResolveAlert = (alert: AIAlert) => {
    setSelectedAlert(alert);
    setIsTransferModalOpen(true);
  };

  const executeTransfer = () => {
    if (selectedAlert) {
      setResolvedAlerts(new Set([...resolvedAlerts, selectedAlert.id]));
      setIsTransferModalOpen(false);
      setSelectedAlert(null);
    }
  };

  const visibleAlerts = aiAlerts.filter(a => !resolvedAlerts.has(a.id));

  // Determine if forecast needs to be modified due to resolution
  const displayForecastData = forecastData.map(d => {
    if (resolvedAlerts.has('a1')) {
      return {
        ...d,
        EUR: d.EUR < 0 ? Math.max(d.EUR + 250000, 50000) : d.EUR, // Mocking the fix
        GBP: d.GBP - 215000,
      };
    }
    return d;
  });

  return (
    <div className="flex h-screen bg-[#080808] font-sans overflow-hidden text-[#E0E0E0]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0A0A] text-[#999] flex-shrink-0 flex flex-col hidden md:flex border-r border-[#1F1F1F]">
        <div className="p-6 flex items-center gap-3 text-[#E0E0E0]">
          <div className="w-8 h-8 bg-emerald-500 rounded-sm flex items-center justify-center text-black font-bold">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <span className="text-xl font-medium tracking-tight">FlowPredict</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={<BarChart3 />} label="Дашборд" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Wallet />} label="Счета" active={activeTab === 'accounts'} onClick={() => setActiveTab('accounts')} />
          <NavItem icon={<ArrowRightLeft />} label="Переводы" active={activeTab === 'transfers'} onClick={() => setActiveTab('transfers')} />
          <NavItem icon={<Server />} label="Архитектура" active={activeTab === 'architecture'} onClick={() => setActiveTab('architecture')} />
          <NavItem icon={<Settings />} label="Настройки" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-[#141414] border border-[#222] rounded-xl p-4 flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?u=a" alt="User" className="w-10 h-10 rounded-full border-2 border-[#333]" />
            <div>
              <p className="text-sm font-medium text-[#E0E0E0]">Alex Smirnov</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#666]">Head of Treasury</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-[#0A0A0A] border-b border-[#1F1F1F] flex items-center justify-between px-6 lg:px-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-[#888] hover:text-[#E0E0E0]">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-light text-[#E0E0E0]">
              {activeTab === 'dashboard' ? 'Обзор ликвидности' : 
               activeTab === 'architecture' ? 'Архитектура системы' : 'Управление'}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
              <input 
                type="text" 
                placeholder="Поиск по транзакциям..." 
                className="pl-10 pr-4 py-2 bg-[#141414] rounded-full border border-[#222] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all w-64 text-sm text-[#E0E0E0] placeholder:text-[#666]"
              />
            </div>
            <button className="relative p-2 text-[#888] hover:text-[#E0E0E0] transition-colors">
              <Bell className="w-6 h-6" />
              {visibleAlerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 border-2 border-[#0A0A0A] rounded-full"></span>
              )}
            </button>
          </div>
        </header>

        {/* Dashboard / Tabs Content */}
        {activeTab === 'dashboard' ? (
          <div className="flex-1 overflow-auto p-6 lg:p-10 hide-scrollbar">
            <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wallets.map(wallet => (
                <div key={wallet.id} className="bg-[#0A0A0A] p-6 border border-[#1F1F1F] rounded-lg shadow-sm flex flex-col hover:border-[#333] transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-[#141414] border border-[#222] flex items-center justify-center text-lg font-medium text-[#E0E0E0] group-hover:border-emerald-500/50 group-hover:text-emerald-500 transition-colors">
                        {wallet.symbol}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#888] uppercase tracking-widest">{wallet.name}</h3>
                        <p className="text-xs text-[#555]">{wallet.bank}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-light text-emerald-500 font-mono tracking-tight">
                      {formatCurrency(wallet.id === '1' && resolvedAlerts.has('a1') ? wallet.balance + 250000 : wallet.balance, wallet.currency)}
                    </h2>
                    <div className="mt-2 flex items-center gap-2">
                      {wallet.trend > 0 ? (
                        <div className="flex items-center text-emerald-400 bg-emerald-900/30 border border-emerald-900 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                          <TrendingUp className="w-3 h-3 mr-1" /> +{wallet.trend}%
                        </div>
                      ) : (
                        <div className="flex items-center text-amber-400 bg-amber-900/30 border border-amber-900 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                          <TrendingDown className="w-3 h-3 mr-1" /> {wallet.trend}%
                        </div>
                      )}
                      <span className="text-xs text-[#666]">за 30 дней</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Alerts Section */}
            {visibleAlerts.length > 0 && (
              <div className="bg-amber-500/10 rounded-lg border border-amber-500/20 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded flex-shrink-0 mt-1">
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-amber-500 uppercase tracking-tight">{visibleAlerts[0].title}</h2>
                      <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-amber-500/20 text-amber-500 border border-amber-500/50 rounded">
                        Высокий приоритет
                      </span>
                    </div>
                    <p className="text-amber-200/70 mt-2 text-sm leading-relaxed max-w-4xl">
                      {visibleAlerts[0].description}
                    </p>
                    
                    <div className="mt-6 bg-[#0A0A0A] rounded p-5 border border-[#1F1F1F] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-[#666] uppercase tracking-[0.2em] mb-1">Рекомендация ИИ</p>
                        <p className="text-sm text-[#E0E0E0]">
                          Перевести {formatCurrency(visibleAlerts[0].recommendation.amountFrom, visibleAlerts[0].recommendation.currencyFrom)} из 
                          <span className="mx-1 px-2 py-0.5 bg-[#141414] border border-[#222] rounded text-[#E0E0E0]">Резервного фонда</span> 
                          на 
                          <span className="mx-1 px-2 py-0.5 bg-[#141414] border border-[#222] rounded text-[#E0E0E0]">Операционный счет</span>
                        </p>
                        <p className="text-xs text-[#888] mt-2 flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
                          {visibleAlerts[0].recommendation.reason}
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => handleResolveAlert(visibleAlerts[0])}
                        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 group whitespace-nowrap"
                      >
                        Применить решение
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {resolvedAlerts.has('a1') && (
              <div className="bg-emerald-900/20 border border-emerald-900 rounded p-4 flex items-center gap-4 text-[#E0E0E0]">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <p className="text-sm font-medium">Угроза кассового разрыва устранена. Баланс счетов стабилизирован.</p>
              </div>
            )}

            {/* Chart Area */}
            <div className="bg-[#0A0A0A] rounded-lg p-6 border border-[#1F1F1F] relative">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-serif font-light text-[#E0E0E0]">ML Прогноз ликвидности (7 дней)</h3>
                  <p className="text-sm text-[#666] mt-1">Основано на исторических паттернах и графиках платежей</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-widest text-[#888]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500"></span> EUR
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#333]"></span> USD
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500"></span> GBP
                  </div>
                </div>
              </div>
              
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayForecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEUR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorUSD" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#333333" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#333333" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A1A" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#666', fontSize: 10, textTransform: 'uppercase' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#666', fontSize: 10 }}
                      tickFormatter={(value) => `${value / 1000}k`}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#141414', borderRadius: '4px', border: '1px solid #222', color: '#E0E0E0' }}
                      itemStyle={{ color: '#E0E0E0' }}
                      formatter={(value: number, name: string) => [formatCurrency(value, name), name]}
                      labelStyle={{ color: '#888', marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }}
                    />
                    <ReferenceLine y={0} stroke="#333" />
                    
                    <Area type="monotone" dataKey="GBP" stackId="3" stroke="#f59e0b" fill="transparent" strokeWidth={1} strokeDasharray="4 4" />
                    <Area type="monotone" dataKey="USD" stackId="2" stroke="#333" fill="url(#colorUSD)" strokeWidth={2} />
                    <Area type="monotone" dataKey="EUR" stackId="1" stroke="#10b981" fill="url(#colorEUR)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {!resolvedAlerts.has('a1') && (
                <div className="absolute top-1/2 left-[78%] bg-amber-500 text-black text-[10px] font-bold px-3 py-1.5 rounded shadow-[0_0_15px_rgba(245,158,11,0.3)] -translate-x-1/2 -translate-y-12 animate-pulse flex items-center gap-1.5 uppercase tracking-widest">
                  <AlertTriangle className="w-3 h-3" />
                  GAP
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500 rotate-45"></div>
                </div>
              )}
            </div>
          </div>
        </div>
        ) : activeTab === 'architecture' ? (
          <div className="flex-1 overflow-auto p-6 lg:p-10 hide-scrollbar">
            <div className="max-w-7xl mx-auto space-y-8 pb-20">
              
              {/* Description / Analogy */}
              <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-lg p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#141414] border border-[#222] rounded mt-1">
                    <Info className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold uppercase tracking-widest text-[#E0E0E0] mb-3">Принцип работы</h2>
                    <p className="text-[#888] leading-relaxed text-sm">
                      <span className="text-[#E0E0E0]">Упрощённая аналогия:</span> Представьте, что у компании есть множество кошельков в разных банках и валютах. Деньги постоянно приходят и уходят, но часто с задержками — как посылки на почте. Система анализирует историю этих «посылок», выявляет скрытые паттерны и предсказывает кассовые разрывы, учитывая задержки клиринга (SWIFT/SEPA) и расписания выплат. И сразу предлагает: перекинуть деньги для покрытия дефицита.
                    </p>
                  </div>
                </div>
              </div>

              {/* Three Layers */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666] mb-4">Технические слои платформы</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-lg p-6 hover:border-[#333] transition-colors">
                    <Database className="w-6 h-6 text-[#666] mb-4" />
                    <h4 className="font-bold text-sm text-[#E0E0E0] mb-2">Слой 1: Сбор данных</h4>
                    <p className="text-xs text-[#888] leading-relaxed">
                      Подключение к банковским API и импорт выписок. Сбор транзакций, остатков, расписаний платежей и внешних факторов (праздники, клиринги, кросс-курсы).
                    </p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-emerald-900/50 rounded-lg p-6 relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 opacity-5">
                       <BrainCircuit className="w-48 h-48 text-emerald-500" />
                    </div>
                    <BrainCircuit className="w-6 h-6 text-emerald-500 mb-4 relative z-10" />
                    <h4 className="font-bold text-sm text-[#E0E0E0] mb-2 relative z-10">Слой 2: ML-прогноз</h4>
                    <p className="text-xs text-[#888] leading-relaxed relative z-10">
                      Модель (LightGBM) обучается на исторических транзакциях. Прогнозирует баланс на 7 дней вперед, учитывая задержки каналов и сезонные параметры, с доверительным интервалом.
                    </p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-lg p-6 hover:border-[#333] transition-colors">
                    <Zap className="w-6 h-6 text-amber-500 mb-4" />
                    <h4 className="font-bold text-sm text-[#E0E0E0] mb-2">Слой 3: Алерты и действия</h4>
                    <p className="text-xs text-[#888] leading-relaxed">
                      Генерация рекомендаций при риске разрыва. Если прогноз падает ниже порога — менеджер одобряет действие, а система инициирует перевод капитала через API.
                    </p>
                  </div>
                </div>
              </div>

              {/* Onboarding Tiers */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666] mb-4">Интеграция: Низкий порог входа</h3>
                <div className="flex flex-col gap-px bg-[#1F1F1F] rounded-lg overflow-hidden border border-[#1F1F1F]">
                   <div className="bg-[#0A0A0A] p-6 flex items-center gap-6 group">
                     <div className="w-12 h-12 bg-[#141414] border border-[#222] rounded flex items-center justify-center text-[#666] flex-shrink-0 group-hover:text-emerald-500 group-hover:border-emerald-500/30 transition-colors">
                       <UploadCloud className="w-5 h-5" />
                     </div>
                     <div className="flex-1">
                       <div className="flex items-center justify-between mb-1">
                         <h4 className="font-bold text-sm text-[#E0E0E0]">Уровень 1: Без интеграции (День 1)</h4>
                         <span className="text-[10px] px-2 py-0.5 bg-[#141414] border border-[#222] rounded text-[#888] uppercase font-bold tracking-widest">Порог входа: 0</span>
                       </div>
                       <p className="text-xs text-[#666]">
                         Ручная загрузка CSV-выписок из банка клиента. Модель начинает строить прогнозы, не требуя IT-ресурсов.
                       </p>
                     </div>
                   </div>
                   <div className="bg-[#0A0A0A] p-6 flex items-center gap-6 group">
                     <div className="w-12 h-12 bg-[#141414] border border-[#222] rounded flex items-center justify-center text-[#666] flex-shrink-0 group-hover:text-emerald-500 group-hover:border-emerald-500/30 transition-colors">
                       <Network className="w-5 h-5" />
                     </div>
                     <div className="flex-1">
                       <div className="flex items-center justify-between mb-1">
                         <h4 className="font-bold text-sm text-[#E0E0E0]">Уровень 2: Полуавтомат (Неделя 2-4)</h4>
                         <span className="text-[10px] px-2 py-0.5 bg-emerald-900/20 border border-emerald-900/50 rounded text-emerald-500 uppercase font-bold tracking-widest">Целевой</span>
                       </div>
                       <p className="text-xs text-[#666]">
                         Подключение через стандартные Open Banking API (PSD2 / UK Open Banking). Настройка 1–2 дня.
                       </p>
                     </div>
                   </div>
                   <div className="bg-[#0A0A0A] p-6 flex items-center gap-6 group">
                     <div className="w-12 h-12 bg-[#141414] border border-[#222] rounded flex items-center justify-center text-emerald-500 flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                       <Server className="w-5 h-5" />
                     </div>
                     <div className="flex-1">
                       <div className="flex items-center justify-between mb-1">
                         <h4 className="font-bold text-sm text-[#E0E0E0]">Уровень 3: Полная автоматизация (Мес. 2+)</h4>
                         <span className="text-[10px] px-2 py-0.5 bg-[#141414] border border-[#222] rounded text-[#888] uppercase font-bold tracking-widest">Enterprise</span>
                       </div>
                       <p className="text-xs text-[#666]">
                         API-интеграция с платёжными шлюзами (Railsr, Banking Circle, Modulr). Система сама инициирует Swift/SEPA переводы.
                       </p>
                     </div>
                   </div>
                </div>
              </div>

              {/* Risk Matrix */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">Матрица Рисков</h3>
                  <div className="flex items-center gap-2">
                     <ShieldAlert className="w-4 h-4 text-emerald-500" />
                     <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Митигация: Human-in-the-loop (первые 6 мес)</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#141414] p-5 rounded-lg border border-[#222]">
                    <h4 className="text-xs font-bold text-rose-400 mb-3 uppercase tracking-widest">Технические</h4>
                    <ul className="space-y-2 text-xs text-[#888] list-disc pl-4 marker:text-[#444]">
                      <li>Ошибки ML на ранних этапах до накопления датасета</li>
                      <li>Нестабильность API некоторых банков (занижение real-time)</li>
                      <li>Слепое доверие ML при излишне оптимистичном прогнозе</li>
                    </ul>
                  </div>
                  <div className="bg-[#141414] p-5 rounded-lg border border-[#222]">
                    <h4 className="text-xs font-bold text-[#888] mb-3 uppercase tracking-widest text-[#E0E0E0]">Бизнес</h4>
                    <ul className="space-y-2 text-xs text-[#888] list-disc pl-4 marker:text-[#444]">
                      <li>Долгий цикл продаж из-за недоверия к внешним системам</li>
                      <li>Тяжелый Security/Compliance Audit перед внедрением</li>
                      <li>Конкуренция с гигантами (Kyriba, HighRadius)</li>
                    </ul>
                  </div>
                  <div className="bg-[#141414] p-5 rounded-lg border border-[#222]">
                    <h4 className="text-xs font-bold text-amber-500 mb-3 uppercase tracking-widest">Юридические</h4>
                    <ul className="space-y-2 text-xs text-[#888] list-disc pl-4 marker:text-[#444]">
                      <li>Ответственность за убытки от ошибочных рекомендаций</li>
                      <li>Требования GDPR / PCI DSS к обработке финансовых данных</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-[#666] text-sm uppercase tracking-widest">
            Модуль в разработке
          </div>
        )}
      </main>

      {/* Transfer Modal - "One Click" resolution */}
      {isTransferModalOpen && selectedAlert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-lg w-full max-w-lg overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            <div className="bg-[#141414] border-b border-[#222] px-8 py-6 text-center">
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#E0E0E0]">Подтверждение перевода</h2>
              <p className="text-[#666] text-[10px] uppercase tracking-[0.2em] mt-1">Одобрено AI на основе политик ликвидности</p>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-8 relative">
                <div className="flex-1 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#888] mb-1">Со счета (GBP)</p>
                  <p className="text-2xl font-light font-mono text-[#E0E0E0]">{formatCurrency(selectedAlert.recommendation.amountFrom, selectedAlert.recommendation.currencyFrom)}</p>
                </div>
                
                <div className="w-12 h-12 bg-[#1A1A1A] border border-[#333] rounded flex z-10 items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#888] shadow-sm">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                
                <div className="absolute top-1/2 left-0 right-0 h-px bg-[#222] border-dashed border-t border-[#333]"></div>

                <div className="flex-1 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#888] mb-1">На счет (EUR)</p>
                  <p className="text-2xl font-light font-mono text-emerald-500">{formatCurrency(selectedAlert.recommendation.amountTo, selectedAlert.recommendation.currencyTo)}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm py-3 border-b border-[#1F1F1F]">
                  <span className="text-[#666]">Курс конвертации</span>
                  <span className="font-mono text-[#E0E0E0]">1 GBP = 1.16 EUR</span>
                </div>
                <div className="flex justify-between text-sm py-3 border-b border-[#1F1F1F]">
                  <span className="text-[#666]">Комиссия банка</span>
                  <span className="font-medium text-emerald-500">Отсутствует (Внутригрупповой)</span>
                </div>
                <div className="flex justify-between text-sm py-3 border-b border-[#1F1F1F]">
                  <span className="text-[#666]">Ожидаемое зачисление</span>
                  <span className="font-medium text-[#E0E0E0]">Мгновенно</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsTransferModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-[#141414] hover:bg-[#1A1A1A] border border-[#222] text-[#888] font-bold text-xs uppercase tracking-widest rounded transition-colors"
                >
                  Отмена
                </button>
                <button 
                  onClick={executeTransfer}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)] flex justify-center items-center gap-2"
                >
                  Подтвердить
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-bold uppercase tracking-widest transition-colors my-1",
        active 
          ? "bg-white text-black" 
          : "text-[#888] hover:text-[#E0E0E0] hover:bg-[#141414]"
      )}
    >
      <div className={cn("w-4 h-4", active ? "text-black" : "text-[#666]")}>
        {icon}
      </div>
      {label}
    </button>
  );
}
