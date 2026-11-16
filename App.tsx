import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Bell, Sun, Moon, Lightbulb, TriangleAlert, ArrowLeft, Download, Settings as SettingsIcon, Trash2, Play, RotateCcw, Zap, X, Copy, Users, Package, Scale, Ruler, Sparkles, Clock, BookOpen, Maximize2, Flashlight, FlashlightOff } from 'lucide-react';

type Role='Admin Hub'|'Hub Member';
type View='login'|'dashboard'|'measure'|'template';
type Lang='en'|'id';
type Pkg={_id?:string; timestamp:string; dateKey:string; resi:string; berat:number; panjang:number; lebar:number; tinggi:number; pengukur:string; hub:string; aiP:number; aiL:number; aiT:number; aiBerat:number; kondisi:string; jenis:string};
type Learn={_id?:string; timestamp:string; hub:string; aiP:number; aiL:number; aiT:number; aiBerat:number; fP:number; fL:number; fT:number; fBerat:number; dP:number; dL:number; dT:number; dBerat:number; kondisi:string; jenis:string};
type Notif={_id?:string; title:string; body:string; time:string; read:boolean; kind:string};
type Session={kode:string; sheetId:string; nama:string; role:Role; hub:string; gasUrl:string};

const DICT = {
  en: {
    activation:'HUB ACTIVATION', hubCode:'HUB CODE', sheetLink:'SHEET LINK / ID', measurerName:'MEASURER NAME', hubName:'HUB NAME', role:'ROLE', gasUrl:'GAS URL', activateEnter:'ACTIVATE & ENTER', demo:'DEMO',
    completeFields:'Complete Hub Code, Sheet, and Name.', codeBound:'This code is already bound to another Hub Sheet.',
    settings:'SETTINGS', closeSettings:'Close settings', language:'LANGUAGE', english:'ENGLISH', indonesian:'BAHASA INDONESIA',
    tingSound:'Sound', tingOn:'ON — sound on scan & save', tingOff:'OFF — no sound', vibration:'Vibration', vibOn:'ON — vibrate on scan & save', vibOff:'OFF — no vibration', volumeNote:'Sound volume follows the phone volume.',
    darkMode:'Dark Mode', darkOn:'Dark mode is on', darkOff:'Light mode is on', downloadMore:'More Downloads', downloadMoreDesc:'Date range & all packages', template:'Template', templateDesc:'Template & Sheet Setup',
    adminOnly:'Admin Hub settings are only for Admin Hub.', adminHub:'Admin Hub', hubClosing:'Hub & Closing', hubLabel:'Hub', closingTime:'Closing Time', gasUrlLabel:'GAS URL', sheetIdLabel:'Sheet ID', codeHubLabel:'Hub Code', saveSettings:'SAVE SETTINGS', closeHub:'CLOSE HUB', openHub:'OPEN HUB', hubStatus:'Hub:', hubOpen:'Open', hubClosed:'Closed',
    members:'Members', newMemberPh:'New member name', add:'+ ADD', aiAccuracy:'AI Accuracy', dimension:'Dimension', weight:'Weight', corrections:'Corrections', viewLearning:'View AI_Learning Data', deleteData:'Delete Data', deleteBtn:'DELETE', resetDemo:'RESET DEMO', logout:'LOG OUT',
    notifications:'Notifications', noNotif:'No notifications yet.', deleteAll:'DELETE ALL', closeNotif:'Close notifications',
    measurePackage:'MEASURE PACKAGE', back:'BACK', sessionLabel:'Session', startMeasure:'START MEASURE', dimensions:'DIMENSIONS', weightLabel:'WEIGHT', trackingNo:'TRACKING NO', scan:'SCAN', length:'Length (cm)', width:'Width (cm)', height:'Height (cm)', weightField:'Weight (Kg)', save:'SAVE ✓', cancel:'CANCEL', fullScreen:'FULL SCREEN', exitFullScreen:'EXIT FULL SCREEN',
    hub:'HUB', totalPackages:'TOTAL PACKAGES TODAY', totalWeight:'TOTAL WEIGHT TODAY', avgWeight:'AVERAGE WEIGHT', avgSize:'AVERAGE SIZE', aiDimAcc:'AI DIMENSION ACCURACY', aiWeightAcc:'AI WEIGHT ACCURACY', sevenDay:'7 DAYS', download:'DOWNLOAD', downloadRange:'DOWNLOAD RANGE', downloadAll:'DOWNLOAD ALL', dashboard:'Dashboard', templateTitle:'Template', copyHeader:'Copy header',
    hubClosedBanner:'Hub closed — MEASURE button is disabled.', hubClosedToast:'Hub closed', saved:'Saved!', cancelled:'Cancelled', scanResi:'Scan Tracking No:', settingsSaved:'Settings saved', memberAdded:'member added', deleted:'Deleted:', downloadDone:'Downloaded', packages:'packages', closing:'Closing', snooze:'SNOOZE 1 HOUR', closeNow:'CLOSE NOW', closingSnoozed:'Closing snoozed for 1 hour', hubClosedDone:'Hub closed', hubOpenedDone:'Hub opened', saveFirst:'Fill in Tracking No first.', sessionNotActive:'Session is not active.', saving:'Saving…', hubClosedMeasure:'Hub Closed — measuring is locked.', hubClosedScan:'Hub closed — scan is locked.', calibFailPrefix:'Calibration failed:', calibNotPassed:'Calibration not passed:', calibHint:'Position the package in the center, turn on the light, keep the phone still',
    packagesBroke:'PACKAGES REACHED!', packagesBrokeBody:'packages measured today!', totalWeightLabel:'Total Weight:', avgLabel:'Average:', mostActive:'Most Active:', dateRange:'Date Range', todayPackages:'packages today', today:'Today', flashTurnOn:'TURN ON FLASH', flashTurnOff:'TURN OFF FLASH', flashUnsupported:'Flash is not supported on this device.', copied:'Copied',
  },
  id: {
    activation:'Aktivasi Hub', hubCode:'Kode Hub', sheetLink:'Tautan / ID Sheet', measurerName:'Nama Pengukur', hubName:'Nama Hub', role:'Peran', gasUrl:'URL GAS', activateEnter:'Aktifkan dan Masuk', demo:'Demo',
    completeFields:'Lengkapi Kode Hub, Sheet, dan Nama.', codeBound:'Kode ini sudah terikat ke Sheet Hub lain.',
    settings:'Pengaturan', closeSettings:'Tutup Pengaturan', language:'Bahasa', english:'ENGLISH', indonesian:'BAHASA INDONESIA',
    tingSound:'Suara', tingOn:'Aktif — bunyi saat pindai dan simpan.', tingOff:'Nonaktif — tanpa bunyi.', vibration:'Getar', vibOn:'Aktif — bergetar saat pindai dan simpan.', vibOff:'Nonaktif — tanpa getar.', volumeNote:'Volume suara mengikuti volume ponsel.',
    darkMode:'Mode Gelap', darkOn:'Mode gelap aktif.', darkOff:'Mode terang aktif.', downloadMore:'Unduhan Lainnya', downloadMoreDesc:'Rentang tanggal dan semua paket.', template:'Template', templateDesc:'Template dan Pengaturan Sheet',
    adminOnly:'Pengaturan Admin Hub hanya untuk Admin Hub.', adminHub:'Admin Hub', hubClosing:'Hub dan Penutupan', hubLabel:'Hub', closingTime:'Jam Penutupan', gasUrlLabel:'URL GAS', sheetIdLabel:'ID Sheet', codeHubLabel:'Kode Hub', saveSettings:'Simpan Pengaturan', closeHub:'Tutup Hub', openHub:'Buka Hub', hubStatus:'Hub:', hubOpen:'Buka', hubClosed:'Tutup',
    members:'Anggota', newMemberPh:'Nama anggota baru', add:'+ Tambah', aiAccuracy:'Akurasi AI', dimension:'Dimensi', weight:'Berat', corrections:'Koreksi', viewLearning:'Lihat Data AI_Learning', deleteData:'Hapus Data', deleteBtn:'Hapus', resetDemo:'Atur Ulang Demo', logout:'Keluar',
    notifications:'Notifikasi', noNotif:'Belum ada notifikasi.', deleteAll:'Hapus Semua', closeNotif:'Tutup notifikasi',
    measurePackage:'Ukur Paket', back:'Kembali', sessionLabel:'Sesi Ini', startMeasure:'Mulai Ukur', dimensions:'Dimensi', weightLabel:'Berat', trackingNo:'Nomor Resi', scan:'Pindai', length:'Panjang (cm)', width:'Lebar (cm)', height:'Tinggi (cm)', weightField:'Berat (kg)', save:'Simpan ✓', cancel:'Batal', fullScreen:'Layar Penuh', exitFullScreen:'Keluar dari Layar Penuh',
    hub:'Hub', totalPackages:'Total Paket Hari Ini', totalWeight:'Total Berat Hari Ini', avgWeight:'Rata-rata Berat', avgSize:'Rata-rata Ukuran', aiDimAcc:'Akurasi Dimensi AI', aiWeightAcc:'Akurasi Berat AI', sevenDay:'Grafik 7 Hari', download:'Unduh', downloadRange:'Unduh Rentang', downloadAll:'Unduh Semua', dashboard:'Dasbor', templateTitle:'Template', copyHeader:'Salin Judul',
    hubClosedBanner:'Hub tutup — tombol Ukur nonaktif.', hubClosedToast:'Hub tutup.', saved:'Tersimpan!', cancelled:'Dibatalkan.', scanResi:'Pindai Nomor Resi:', settingsSaved:'Pengaturan tersimpan.', memberAdded:'ditambahkan.', deleted:'Dihapus:', downloadDone:'Diunduh', packages:'paket', closing:'Penutupan', snooze:'Tunda 1 Jam', closeNow:'Tutup Sekarang', closingSnoozed:'Penutupan ditunda selama 1 jam.', hubClosedDone:'Hub ditutup.', hubOpenedDone:'Hub dibuka.', saveFirst:'Isi Nomor Resi terlebih dahulu.', sessionNotActive:'Sesi belum aktif.', saving:'Menyimpan…', hubClosedMeasure:'Hub tutup — pengukuran terkunci.', hubClosedScan:'Hub tutup — pindai terkunci.', calibFailPrefix:'Kalibrasi gagal:', calibNotPassed:'Kalibrasi belum lolos:', calibHint:'Posisikan paket di tengah, nyalakan lampu, dan diamkan ponsel.',
    packagesBroke:'Paket Tembus!', packagesBrokeBody:'paket sudah diukur hari ini!', totalWeightLabel:'Total Berat:', avgLabel:'Rata-rata:', mostActive:'Paling Rajin:', dateRange:'Rentang Tanggal', todayPackages:'paket hari ini', today:'Hari Ini', flashTurnOn:'Nyalakan Flash', flashTurnOff:'Matikan Flash', flashUnsupported:'Flash tidak didukung perangkat ini.', copied:'Tersalin.',
  }
} as const;

const todayKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const fmtDate=(d=new Date())=>d.toLocaleDateString('en-US',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
const timeNow=()=> new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
const r1=(n:number)=>Math.round(n*10)/10;
const vol=(p:number,l:number,t:number)=>r1((p*l*t)/6000);
const inferJenis=(p:number,l:number,t:number)=>{
  const m=Math.max(p,l,t);
  if(m<30) return 'Kecil';
  if(m<42) return 'Sedang';
  if(m<55) return 'Dus';
  if(m<70) return 'Besar';
  return 'Karung';
};
const lightFromBrightness=(b:number)=>{
  if(b<55) return 'Malam';
  if(b<95) return 'Remang-remang';
  if(b<145) return 'Lampu Kuning';
  if(b>235) return 'Backlight-Silau';
  return 'Terang Siang';
};

async function callApi(action:string,args:any){
  const res=await fetch("actions",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action,args})});
  const json=await res.json().catch(()=>({}));
  if(!res.ok||json.error) throw new Error(json.error||`Failed (${res.status})`);
  return json.data;
}
function extractSheet(v:string){
  const s=v.trim(); const m=s.match(/\/d\/([a-zA-Z0-9-_]+)/); if(m) return m[1];
  const m2=s.match(/[?&]id=([a-zA-Z0-9-_]+)/); if(m2) return m2[1];
  return s;
}
function seedPackages():Pkg[]{
  const today=todayKey(); const y=new Date(); y.setDate(y.getDate()-1); const yk=todayKey(y);
  const base:[string,string,string,number,number,number,number,string][]=[
    ['JX1234567890','Andi','Dus',38,28,22,3.9,'Terang Siang'],
    ['JX1234567891','Budi','Karung',45,32,28,6.2,'Terang Siang'],
    ['JX1234567892','Sari','Kecil',22,16,12,0.7,'Terang Siang'],
    ['JX1234567893','Andi','Sedang',32,24,18,2.3,'Remang-remang'],
    ['JX1234567894','Budi','Dus',40,30,25,5.0,'Terang Siang'],
    ['JX1234567895','Sari','Besar',55,40,35,10.2,'Outdoor'],
    ['JX1234567896','Andi','Kecil',18,14,10,0.4,'Terang Siang'],
    ['JX1234567897','Budi','Karung',48,35,30,7.8,'Lampu Kuning'],
    ['JX1234567898','Sari','Sedang',35,25,20,3.4,'Terang Siang'],
    ['JX1234567899','Andi','Dus',36,26,20,3.1,'Bayangan'],
    ['JX1234567900','Budi','Besar',60,42,38,12.5,'Outdoor'],
    ['JX1234567901','Sari','Sedang',30,22,16,1.8,'Terang Siang'],
  ];
  const out: Pkg[]=[];
  base.forEach(([resi,pengukur,jenis,p,l,t,berat,kondisi],i)=>{
    const aiP=p-(i%3===0?3:0), aiL=l, aiT=t-(i%4===0?2:0);
    const aiB=vol(aiP,aiL,aiT);
    out.push({timestamp:`${today}T${String(7+i).padStart(2,'0')}:${String((i*4)%60).padStart(2,'0')}:00`,dateKey:today,resi,pengukur,hub:'Hub Losari',jenis,kondisi,panjang:p,lebar:l,tinggi:t,berat,aiP,aiL,aiT,aiBerat:aiB});
  });
  const yest:[string,string,string,number,number,number,number][]=[
    ['JX1234567801','Andi','Dus',34,25,19,2.7],['JX1234567802','Budi','Karung',42,30,26,5.4],['JX1234567803','Sari','Kecil',20,15,11,0.5],['JX1234567804','Andi','Sedang',33,24,17,2.2],['JX1234567805','Budi','Besar',52,38,32,9.1],['JX1234567806','Sari','Sedang',31,23,18,2.1],['JX1234567807','Andi','Kecil',19,13,9,0.4],['JX1234567808','Budi','Dus',39,29,23,4.2],
  ];
  yest.forEach(([resi,pengukur,jenis,p,l,t,berat],i)=>{
    const aiB=vol(p,l,t);
    out.push({timestamp:`${yk}T${String(8+i).padStart(2,'0')}:15:00`,dateKey:yk,resi,pengukur,hub:'Hub Losari',jenis,kondisi:'Terang Siang',panjang:p,lebar:l,tinggi:t,berat,aiP:p,aiL:l,aiT:t,aiBerat:aiB});
  });
  return out;
}
function seedLearning(pkgs:Pkg[]):Learn[]{
  return pkgs.map(p=>({timestamp:p.timestamp,hub:p.hub,aiP:p.aiP,aiL:p.aiL,aiT:p.aiT,aiBerat:p.aiBerat,fP:p.panjang,fL:p.lebar,fT:p.tinggi,fBerat:p.berat,dP:r1(p.panjang-p.aiP),dL:r1(p.lebar-p.aiL),dT:r1(p.tinggi-p.aiT),dBerat:r1(p.berat-p.aiBerat),kondisi:p.kondisi,jenis:p.jenis}));
}

function AppBulkyLogo(){
  return (
    <span aria-hidden="true" className="flex items-center justify-center shrink-0" style={{width:44,height:44,minWidth:44,minHeight:44,background:'#111',borderRadius:13,padding:4}}>
      <svg width="36" height="36" viewBox="0 0 48 48" fill="none" role="img" aria-label="AppBulky 3D package cube logo">
        <defs>
          <linearGradient id="appbulky-cube" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF6B00"/><stop offset="1" stopColor="#FF9A3D"/>
          </linearGradient>
        </defs>
        <path d="M24 4 42 13.5v19L24 42 6 32.5v-19L24 4Z" fill="url(#appbulky-cube)" stroke="#1E1E1E" strokeWidth="2.6" strokeLinejoin="round"/>
        <path d="M24 4 42 13.5 24 23 6 13.5 24 4Z" fill="#FF9A3D" stroke="#1E1E1E" strokeWidth="2.2" strokeLinejoin="round"/>
        <path d="M24 23v19M6 13.5 24 23M42 13.5 24 23" stroke="#1E1E1E" strokeWidth="2.2" strokeLinejoin="round"/>
        <path d="M24 8.5 35 14.5 24 20.5 13 14.5 24 8.5Z" fill="none" stroke="#1E1E1E" strokeWidth="1.4" strokeLinejoin="round" opacity="0.55"/>
        <path d="M3 17v15M3 20h2M3 24h2M3 28h2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 45.5h28M10 45.5l3.5-2M10 45.5l3.5 2M38 45.5l-3.5-2M38 45.5l-3.5 2M18 45.5v-1.5M24 45.5v-1.5M30 45.5v-1.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}
function HeaderOne({session}:{session:Session|null}){
  const hub = session ? session.hub.toUpperCase() : 'LOGISTICS HUB';
  return (
    <section aria-label="AppBulky and hub info" style={{borderRadius:18,padding:'18px 16px',gap:5}} className="flex flex-col items-center text-center bg-[#FF6B00]">
      <div className="flex items-center justify-center" style={{gap:8}}>
        <AppBulkyLogo/>
        <span className="font-brand leading-none whitespace-nowrap" style={{fontSize:30}}>APPBULKY</span>
      </div>
      <h1 className="font-display font-bold text-white leading-none m-0 whitespace-nowrap" style={{fontSize:18}}>{hub}</h1>
    </section>
  );
}
function HeaderTwo({session,unread,onNotif,onSettings}:{session:Session;unread:number;onNotif:()=>void;onSettings:()=>void}){
  const initial=(session.nama.trim()[0]||'A').toUpperCase();
  return (
    <section aria-label="User, notifications, and settings" style={{height:52,padding:'12px 16px',borderRadius:18}} className="flex items-center justify-between gap-2 bg-[var(--bottom)] border border-[var(--bottom-line)]">
      <div className="flex-1 min-w-0 flex items-center justify-start" style={{gap:8}}>
        <span className="w-[32px] h-[32px] min-w-[32px] min-h-[32px] rounded-full bg-[#FF6B00] text-white flex items-center justify-center font-display font-bold shrink-0" style={{fontSize:14}}>{initial}</span>
        <span className="text-[13px] font-semibold text-[var(--ink)] whitespace-nowrap truncate">{session.nama} • {session.role}</span>
      </div>
      <div className="flex items-center shrink-0" style={{gap:8}}>
        <button onClick={onNotif} className="relative w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-[var(--surface-2)] text-[var(--ink)] rounded-full flex items-center justify-center shrink-0 border border-[var(--line)] transition-transform duration-250 ease-out active:scale-90" aria-label="Notifications">
          <Bell className="w-5 h-5"/>
          {unread>0 && <span className="absolute top-1 right-1 w-[10px] h-[10px] rounded-full bg-[#EF4444] border-2 border-black" />}
        </button>
        <button onClick={onSettings} className="w-[40px] h-[40px] min-w-[40px] min-h-[40px] rounded-full bg-[#FF6B00] text-white flex items-center justify-center shrink-0 transition-all duration-250 ease-out active:scale-90" aria-label="Settings" title="Settings">
          <SettingsIcon className="w-5 h-5"/>
        </button>
      </div>
    </section>
  );
}
function StackedHeaders({session,unread,onNotif,onSettings}:{session:Session;unread:number;onNotif:()=>void;onSettings:()=>void}){
  return (
    <div className="flex flex-col" style={{gap:12,marginTop:12}}>
      <HeaderOne session={session}/>
      <HeaderTwo session={session} unread={unread} onNotif={onNotif} onSettings={onSettings}/>
    </div>
  );
}
function FloatingMeasure({onMeasure,hubClosed,label}:{onMeasure:()=>void;hubClosed:boolean;label:string}){
  return (
    <button onClick={onMeasure} disabled={hubClosed} aria-label={label} className="fixed left-1/2 -translate-x-1/2 z-50 w-[72px] h-[72px] min-w-[72px] min-h-[72px] rounded-full bg-[#FF6B00] text-white flex flex-col items-center justify-center font-display font-bold border-2 border-white/40 shrink-0 disabled:opacity-50 transition-transform duration-200 ease-out active:scale-95 overflow-hidden p-0" style={{bottom:20,boxShadow:'0 12px 28px rgba(0,0,0,.45)'}}>
      <Camera className="w-6 h-6 shrink-0"/><span className="block text-center whitespace-nowrap leading-none mt-1" style={{fontSize:10,letterSpacing:'0.2px',maxWidth:64}}>{label}</span>
    </button>
  );
}

function Inner(){
  const [view,setView]=useState<View>('login');
  const [theme,setTheme]=useState<'dark'|'light'>('dark');
  const [lang,setLang]=useState<Lang>('en');
  const [session,setSession]=useState<Session|null>(null);
  const [packages,setPackages]=useState<Pkg[]>([]);
  const [learning,setLearning]=useState<Learn[]>([]);
  const [notifs,setNotifs]=useState<Notif[]>([]);
  const [bindings,setBindings]=useState<{_id?:string;kode:string;sheetId:string;hub:string}[]>([]);
  const [settingsId,setSettingsId]=useState<string|undefined>(undefined);
  const [backend,setBackend]=useState('Loading data…');
  const [loaded,setLoaded]=useState(false);
  const [showNotifs,setShowNotifs]=useState(false);
  const [showSettings,setShowSettings]=useState(false);
  const [showMoreDownload,setShowMoreDownload]=useState(false);
  const [showAHS,setShowAHS]=useState(false);
  const [showClosingPrompt,setShowClosingPrompt]=useState(false);
  const [closingTime,setClosingTime]=useState('');
  const [hubClosed,setHubClosed]=useState(false);
  const [snoozeUntil,setSnoozeUntil]=useState('');
  const [members,setMembers]=useState<string[]>(['Andi','Budi','Sari']);
  const [rangeStart,setRangeStart]=useState(todayKey());
  const [rangeEnd,setRangeEnd]=useState(todayKey());
  const [statusMsg,setStatusMsg]=useState('');
  const [newMember,setNewMember]=useState('');
  const [kode,setKode]=useState(''); const [sheetInput,setSheetInput]=useState(''); const [nama,setNama]=useState('');
  const [role,setRole]=useState<Role>('Hub Member'); const [hubInput,setHubInput]=useState('Hub Losari'); const [gasUrl,setGasUrl]=useState('');
  const [loginError,setLoginError]=useState(''); const [loginBusy,setLoginBusy]=useState(false);
  const [sesi,setSesi]=useState(0);
  const [resi,setResi]=useState('');
  const [jenis,setJenis]=useState('Sedang');
  const [kondisi,setKondisi]=useState('Terang Siang');
  const [aiDims,setAiDims]=useState({p:35,l:25,t:20,berat:2.9});
  const [finalDims,setFinalDims]=useState({p:35,l:25,t:20});
  const [berat,setBerat]=useState(2.9);
  const [manualWeight,setManualWeight]=useState(false);
  const [hasAI,setHasAI]=useState(false);
  const [detecting,setDetecting]=useState(false);
  const [detectStep,setDetectStep]=useState('');
  const [flash,setFlash]=useState(false);
  const [camMsg,setCamMsg]=useState('Activating camera…');
  const [camError,setCamError]=useState('');
  const [camStarting,setCamStarting]=useState(false);
  const [toast,setToast]=useState('');
  const [measureMsg,setMeasureMsg]=useState('');
  const videoRef=useRef<HTMLVideoElement|null>(null);
  const streamRef=useRef<MediaStream|null>(null);
  const containerRef=useRef<HTMLDivElement|null>(null);
  const camRunRef=useRef(0);

  const [soundOn,setSoundOn]=useState(true);
  const [vibrateOn,setVibrateOn]=useState(true);
  const [flashOn,setFlashOn]=useState(false);
  const [flashError,setFlashError]=useState('');
  const [isFullscreen,setIsFullscreen]=useState(false);
  const [calibCentered,setCalibCentered]=useState(false);
  const [calibLight,setCalibLight]=useState(false);
  const [calibStable,setCalibStable]=useState(false);
  const [calibProgress,setCalibProgress]=useState(0);
  const [calibFail,setCalibFail]=useState('');
  const [brightnessVal,setBrightnessVal]=useState(0);
  const audioRef=useRef<AudioContext|null>(null);
  const canvasRef=useRef<HTMLCanvasElement|null>(null);
  const prevAvgRef=useRef<number|null>(null);
  const stableCountRef=useRef(0);
  const lastInteractRef=useRef(Date.now());
  const calibStartRef=useRef(0);
  const soundRef=useRef(true); const vibrateRef=useRef(true);
  const calibRef=useRef({centered:false,light:false,stable:false});
  const langRef=useRef<Lang>('en');
  useEffect(()=>{ soundRef.current=soundOn; },[soundOn]);
  useEffect(()=>{ vibrateRef.current=vibrateOn; },[vibrateOn]);
  useEffect(()=>{ langRef.current=lang; },[lang]);
  useEffect(()=>{ calibRef.current={centered:calibCentered,light:calibLight,stable:calibStable}; },[calibCentered,calibLight,calibStable]);

  const t = DICT[lang];
  const autoJenis = inferJenis(finalDims.p, finalDims.l, finalDims.t);

  // Retrieve fragment: fast rising arpeggio, 0.35s total, near-max gain without clipping.
  // No volume slider — follows system volume. Respects the Sound ON/OFF setting via soundRef.
  function playTing(kind:'success'|'fail'='success'){
    if(!soundRef.current) return;
    try{
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if(!Ctx) return;
      if(!audioRef.current) audioRef.current = new Ctx();
      const ctx = audioRef.current;
      if(ctx.state==='suspended') void ctx.resume();
      const t0 = ctx.currentTime + 0.01;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.92, t0);
      master.connect(ctx.destination);
      if(kind==='fail'){
        const o = ctx.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(220, t0);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.8, t0+0.012);
        g.gain.setValueAtTime(0.8, t0+0.22);
        g.gain.exponentialRampToValueAtTime(0.0001, t0+0.32);
        o.connect(g); g.connect(master); o.start(t0); o.stop(t0+0.34);
        return;
      }
      // Retrieve: E5 (659Hz) -> A5 (880Hz) -> E6 (1318Hz), each 0.08-0.10s,
      // sine + triangle, fast attack, last note slides up so it feels "retrieved".
      const notes: { freq:number; at:number; dur:number; slideTo?:number }[] = [
        { freq: 659.25, at: 0, dur: 0.09 },
        { freq: 880, at: 0.09, dur: 0.09 },
        { freq: 1318.51, at: 0.18, dur: 0.17, slideTo: 1567.98 },
      ];
      notes.forEach(({ freq, at, dur, slideTo }) => {
        const start = t0 + at;
        const end = start + dur;
        (['sine', 'triangle'] as const).forEach((type, idx) => {
          const o = ctx.createOscillator(); o.type = type;
          o.frequency.setValueAtTime(freq, start);
          if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, end);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, start);
          g.gain.exponentialRampToValueAtTime(idx === 0 ? 0.62 : 0.38, start + 0.008);
          g.gain.exponentialRampToValueAtTime(0.0001, end);
          o.connect(g); g.connect(master); o.start(start); o.stop(end + 0.02);
        });
      });
    }catch(_){ /* sound is optional, never crash */ }
  }
  function doVibrate(ms:number){
    if(!vibrateRef.current) return;
    try{ if('vibrate' in navigator) navigator.vibrate(ms); }catch(_){}
  }
  async function toggleFlash(){
    markInteract();
    const track = streamRef.current?.getVideoTracks()[0];
    if(!track){
      setFlashError(t.flashUnsupported);
      setFlashOn(false);
      return;
    }
    const next = !flashOn;
    if(next){
      try{
        const caps = (track.getCapabilities ? track.getCapabilities() : {}) as { torch?: boolean };
        if(caps && caps.torch === false){
          setFlashError(t.flashUnsupported);
          setFlashOn(false);
          return;
        }
      }catch(_){}
    }
    try{
      await track.applyConstraints({ advanced: [{ torch: next } as any] });
      setFlashOn(next);
      setFlashError('');
    }catch(_){
      setFlashError(t.flashUnsupported);
      setFlashOn(false);
    }
  }
  const markInteract=()=>{ lastInteractRef.current=Date.now(); };
  function stopCamera(){
    camRunRef.current++;
    if(streamRef.current){ streamRef.current.getTracks().forEach(t=>{ try{ t.stop(); }catch(_){} }); streamRef.current=null; }
    if(videoRef.current) videoRef.current.srcObject=null;
  }
  async function startCamera(){
    if(camStarting) return;
    setCamStarting(true); setCamError(''); setCamMsg(langRef.current==='id' ? 'Mengaktifkan kamera…' : 'Activating camera…');
    const run=++camRunRef.current;
    const attempts: MediaStreamConstraints[]=[
      {video:{facingMode:'environment',width:{ideal:1280},height:{ideal:720}},audio:false},
      {video:{facingMode:'user'},audio:false},
      {video:true,audio:false},
    ];
    let stream: MediaStream|null=null;
    let lastErr: any=null;
    for(const c of attempts){
      try{ stream=await navigator.mediaDevices.getUserMedia(c); break; }
      catch(e){ lastErr=e; }
    }
    if(run!==camRunRef.current){ if(stream) stream.getTracks().forEach(t=>t.stop()); return; }
    setCamStarting(false);
    if(!stream){
      void lastErr;
      setCamMsg('');
      setCamError(langRef.current==='id' ? 'Izin kamera ditolak - ketuk untuk coba lagi' : 'Camera permission denied - tap to retry');
      return;
    }
    streamRef.current=stream;
    const video=videoRef.current;
    if(video){
      video.srcObject=stream;
      try{ await video.play(); }catch(_){}
    }
    setCamMsg(''); setCamError('');
  }
  async function toggleFullscreen(){
    markInteract();
    if(isFullscreen){
      try{ if(document.fullscreenElement) await document.exitFullscreen(); }catch(_){}
      const el=containerRef.current as any;
      try{ if(el && document.fullscreenElement) await document.exitFullscreen(); }catch(_){}
      setIsFullscreen(false);
      return;
    }
    const el=containerRef.current as any;
    try{
      if(el){
        if(el.requestFullscreen) await el.requestFullscreen();
        else if(el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        else if(el.msRequestFullscreen) el.msRequestFullscreen();
      }
    }catch(_){ /* CSS fallback below */ }
    setIsFullscreen(true);
    const video=videoRef.current;
    if(video && streamRef.current){
      if(video.srcObject!==streamRef.current) video.srcObject=streamRef.current;
      try{ await video.play(); }catch(_){}
    }
  }

  useEffect(()=>{ document.documentElement.setAttribute('data-theme', theme); },[theme]);

  const loadOnce=useRef(false);
  useEffect(()=>{ if(loadOnce.current) return; loadOnce.current=true; (async()=>{
    try{
      const [p,l,n,b,s]=await Promise.all([
        callApi("records.list",{collection:"appbulky_packages",limit:100}),
        callApi("records.list",{collection:"appbulky_learning",limit:100}),
        callApi("records.list",{collection:"appbulky_notifs",limit:100}),
        callApi("records.list",{collection:"appbulky_bindings",limit:100}),
        callApi("records.list",{collection:"appbulky_settings",limit:100}),
      ]);
      const pkgs=(p.records||[]).map((r:any)=>({ _id:r.id, ...r.value }));
      const learns=(l.records||[]).map((r:any)=>({ _id:r.id, ...r.value }));
      const nts=(n.records||[]).map((r:any)=>({ _id:r.id, ...r.value }));
      const bnds=(b.records||[]).map((r:any)=>({ _id:r.id, ...r.value }));
      const sets=(s.records||[]).map((r:any)=>({ _id:r.id, ...r.value }));
      if(pkgs.length===0){
        const seed=seedPackages(); const seedL=seedLearning(seed);
        let saved=0; let err:string|null=null;
        try{ for(const row of seed){ await callApi("records.create",{collection:"appbulky_packages",value:row,idempotency_key:`seed-pkg-${row.resi}`}); saved++; } }catch(e:any){ err=e.message; }
        try{ for(const row of seedL){ await callApi("records.create",{collection:"appbulky_learning",value:row,idempotency_key:`seed-learn-${row.timestamp}-${row.resi||''}`}); } }catch(_){}
        setPackages(seed); setLearning(seedL); setBackend(err?`Demo data loaded temporarily — ${err}`:'Connected');
      } else { setPackages(pkgs); setLearning(learns); setBackend('Connected'); }
      setNotifs(nts); setBindings(bnds);
      if(sets.length>0){ const st=sets[0]; setSettingsId(st._id); if(st.closingTime) setClosingTime(st.closingTime); if(st.members) setMembers(st.members); if(st.hubClosed) setHubClosed(st.hubClosed); if(st.gasUrl) setGasUrl(st.gasUrl); if(typeof st.soundOn==='boolean') setSoundOn(st.soundOn); if(typeof st.vibrateOn==='boolean') setVibrateOn(st.vibrateOn); if(st.lang==='id'||st.lang==='en'){ setLang(st.lang); langRef.current=st.lang; } }
    }catch(e:any){
      setPackages(seedPackages()); setLearning(seedLearning(seedPackages())); setBackend('Backend not available');
    } finally{ setLoaded(true); }
  })(); },[]);

  useEffect(()=>{
    if(view!=='measure'){ setFlashOn(false); setFlashError(''); stopCamera(); return; }
    void startCamera();
    return()=>{ setFlashOn(false); setFlashError(''); stopCamera(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[view]);

  // Full-screen toggle must never recreate <video> or stop the stream:
  // the same element stays mounted, so just resume playback on toggle.
  useEffect(()=>{
    if(view!=='measure') return;
    const video=videoRef.current;
    if(video && streamRef.current){
      if(video.srcObject!==streamRef.current) video.srcObject=streamRef.current;
      if(video.paused) void video.play().catch(()=>{});
    }
  },[isFullscreen, view, camMsg]);
  useEffect(()=>{
    const onChange=()=>{ if(!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    return()=>{ document.removeEventListener('fullscreenchange', onChange); document.removeEventListener('webkitfullscreenchange', onChange); };
  },[]);

  useEffect(()=>{
    if(view!=='measure') return;
    setCalibCentered(false); setCalibLight(false); setCalibStable(false); setCalibFail(''); setCalibProgress(0);
    calibStartRef.current=Date.now(); prevAvgRef.current=null; stableCountRef.current=0;
    if(!canvasRef.current){ canvasRef.current=document.createElement('canvas'); canvasRef.current.width=48; canvasRef.current.height=32; }
    const id=setInterval(()=>{
      const video=videoRef.current;
      const elapsed=Date.now()-calibStartRef.current;
      const idleFor=Date.now()-lastInteractRef.current;
      if(video && video.videoWidth>0 && video.readyState>=2){
        try{
          const cv=canvasRef.current!; const ctx=cv.getContext('2d'); if(!ctx) return;
          ctx.drawImage(video,0,0,48,32);
          const data=ctx.getImageData(0,0,48,32).data;
          let sum=0; const vals:number[]=[];
          for(let i=0;i<data.length;i+=4){ const v=(data[i]*0.299+data[i+1]*0.587+data[i+2]*0.114); sum+=v; vals.push(v); }
          const avg=sum/(data.length/4);
          setBrightnessVal(Math.round(avg));
          setKondisi((prev)=>{ const next=lightFromBrightness(avg); return prev===next?prev:next; });
          const lightOk = avg>=55 && avg<=245;
          setCalibLight(lightOk);
          let cSum=0,cN=0; const cVals:number[]=[];
          for(let y=10;y<22;y++) for(let x=14;x<34;x++){ const idx=(y*48+x)*4; const v=data[idx]*0.299+data[idx+1]*0.587+data[idx+2]*0.114; cSum+=v; cVals.push(v); cN++; }
          const cAvg=cSum/Math.max(1,cN);
          let cVar=0; cVals.forEach(v=>{ cVar+=(v-cAvg)*(v-cAvg); });
          const cStd=Math.sqrt(cVar/Math.max(1,cVals.length));
          const centeredOk = cStd>9 && Math.abs(cAvg-avg)<90;
          setCalibCentered(centeredOk);
          const prev=prevAvgRef.current; const diff=prev===null?999:Math.abs(avg-prev);
          prevAvgRef.current=avg;
          if(diff<7) stableCountRef.current+=1; else stableCountRef.current=0;
          const stableOk = stableCountRef.current>=3 && idleFor>=1000;
          setCalibStable(stableOk);
        }catch(_){}
      } else {
        if(elapsed>1400 && idleFor>=1000){ setCalibCentered(true); setCalibLight(true); setCalibStable(true); setBrightnessVal(150); }
      }
    },280);
    return()=>clearInterval(id);
  },[view]);

  useEffect(()=>{
    const id=setInterval(()=>{
      if(!closingTime||hubClosed||!session) return;
      const now=new Date(); const hhmm=`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      if(snoozeUntil && hhmm<snoozeUntil) return;
      if(hhmm>=closingTime && !showClosingPrompt){ setShowClosingPrompt(true); }
    },30000);
    return()=>clearInterval(id);
  },[closingTime,hubClosed,session,snoozeUntil,showClosingPrompt]);

  const hubPackages=useMemo(()=> session? packages.filter(p=>p.hub===session.hub):[],[packages,session]);
  const todayPkgs=useMemo(()=> hubPackages.filter(p=>p.dateKey===todayKey()),[hubPackages]);
  const totalPaket=todayPkgs.length;
  const totalBerat=r1(todayPkgs.reduce((a,p)=>a+p.berat,0));
  const avgBerat=totalPaket? r1(totalBerat/totalPaket):0;
  const avgP=todayPkgs.length? r1(todayPkgs.reduce((a,p)=>a+p.panjang,0)/todayPkgs.length):0;
  const avgL=todayPkgs.length? r1(todayPkgs.reduce((a,p)=>a+p.lebar,0)/todayPkgs.length):0;
  const avgT=todayPkgs.length? r1(todayPkgs.reduce((a,p)=>a+p.tinggi,0)/todayPkgs.length):0;
  const accDim=todayPkgs.length? Math.round((todayPkgs.filter(p=>p.aiP===p.panjang&&p.aiL===p.lebar&&p.aiT===p.tinggi).length/todayPkgs.length)*100):100;
  const accBerat=todayPkgs.length? Math.round((todayPkgs.filter(p=>Math.abs(p.aiBerat-p.berat)<0.05).length/todayPkgs.length)*100):100;
  const chart=useMemo(()=>{ const arr=[]; for(let i=6;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); const k=todayKey(d); const list=hubPackages.filter(p=>p.dateKey===k); arr.push({label:d.toLocaleDateString('en-US',{weekday:'short'}),date:d.toLocaleDateString('en-US',{day:'numeric',month:'short'}),count:list.length,berat:r1(list.reduce((a,p)=>a+p.berat,0))}); } return arr; },[hubPackages]);
  const maxChart=Math.max(1,...chart.map(c=>c.count));
  const ranking=useMemo(()=>{ const m=new Map<string,{nama:string;count:number;berat:number}>(); todayPkgs.forEach(p=>{ const cur=m.get(p.pengukur)||{nama:p.pengukur,count:0,berat:0}; cur.count++; cur.berat=r1(cur.berat+p.berat); m.set(p.pengukur,cur); }); return [...m.values()].sort((a,b)=>b.count-a.count).slice(0,5); },[todayPkgs]);
  const unread=notifs.filter(n=>!n.read).length;
  const calibration=useMemo(()=>{
    const rel=learning.filter(l=>l.hub===(session?.hub||'')&&l.jenis===autoJenis);
    if(rel.length===0) return {n:0,dP:0,dL:0,dT:0,dBerat:0};
    const avg=(k:keyof Learn)=>rel.reduce((a,x)=>a+(x[k] as number),0)/rel.length;
    return {n:rel.length,dP:avg('dP'),dL:avg('dL'),dT:avg('dT'),dBerat:avg('dBerat')};
  },[learning,session,autoJenis]);

  const calibReasons:string[]=[];
  if(!calibCentered) calibReasons.push(lang==='id' ? 'paket belum di tengah' : 'package not centered');
  if(!calibLight) calibReasons.push(lang==='id' ? 'cahaya belum cukup' : 'light is not enough');
  if(!calibStable) calibReasons.push(lang==='id' ? 'ponsel belum stabil selama 1 detik' : 'phone not stable for 1 second');
  const canMeasure = calibCentered && calibLight && calibStable && !hubClosed;
  const calibMessage = calibReasons.length? `${t.calibNotPassed} ${calibReasons.join(', ')} - ${t.calibHint}` : (lang==='id' ? 'Kalibrasi lolos — siap ukur' : 'Calibration passed — ready to measure');

  function showToast(msg:string){ setToast(msg); setTimeout(()=>setToast(''),2200); }
  function toggleTheme(){ setTheme(theme==='dark'?'light':'dark'); }
  function openMeasure(){ if(hubClosed){ showToast(t.hubClosedToast); return; } setSesi(0); setView('measure'); }
  function openNotifs(){ setShowNotifs(true); setNotifs(prev=>prev.map(n=>({...n,read:true}))); }
  function openSettings(){ setShowSettings(true); }

  async function persistSettings(next:any){
    const value={...next, lang: next.lang ?? langRef.current};
    try{
      if(settingsId) await callApi("records.replace",{collection:"appbulky_settings",id:settingsId,value});
      else { const created=await callApi("records.create",{collection:"appbulky_settings",value,idempotency_key:`settings-${session?.kode||'hub'}`}); setSettingsId(created.id); }
      setBackend('Connected');
    }catch(e:any){ setBackend(`Settings temporarily — ${e.message}`); }
  }
  async function saveFeedback(nextSound:boolean,nextVibrate:boolean){
    setSoundOn(nextSound); setVibrateOn(nextVibrate);
    await persistSettings({kode:session?.kode,hub:session?.hub||hubInput,sheetId:session?.sheetId,closingTime,members,hubClosed,gasUrl:session?.gasUrl||gasUrl,soundOn:nextSound,vibrateOn:nextVibrate});
  }
  async function saveLanguage(nextLang:Lang){
    setLang(nextLang); langRef.current=nextLang;
    await persistSettings({kode:session?.kode,hub:session?.hub||hubInput,sheetId:session?.sheetId,closingTime,members,hubClosed,gasUrl:session?.gasUrl||gasUrl,soundOn,vibrateOn,lang:nextLang});
  }

  async function doLogin(e?:React.FormEvent){
    e?.preventDefault(); setLoginError('');
    const sheetId=extractSheet(sheetInput); const hub=hubInput.trim()||'Hub Losari';
    if(!kode.trim()||!sheetId||!nama.trim()){ setLoginError(t.completeFields); return; }
    const found=bindings.find(b=>b.kode===kode.trim());
    if(found && found.sheetId!==sheetId){ setLoginError(t.codeBound); return; }
    setLoginBusy(true);
    try{
      if(!found){
        try{ await callApi("records.create",{collection:"appbulky_bindings",value:{kode:kode.trim(),sheetId,hub},idempotency_key:`bind-${kode.trim()}`}); setBindings(prev=>[...prev,{kode:kode.trim(),sheetId,hub}]); }catch(_){ setBindings(prev=>[...prev,{kode:kode.trim(),sheetId,hub}]); }
      }
      setSession({kode:kode.trim(),sheetId,nama:nama.trim(),role,hub,gasUrl});
      setView('dashboard');
    }finally{ setLoginBusy(false); }
  }
  function demoLogin(){
    setKode('LOSARI-2026'); setSheetInput('DEMO-LOSARI-SHEET'); setNama('Andi'); setRole('Hub Member'); setHubInput('Hub Losari');
    setSession({kode:'LOSARI-2026',sheetId:'DEMO-LOSARI-SHEET',nama:'Andi',role:'Hub Member',hub:'Hub Losari',gasUrl});
    setView('dashboard');
  }
  function copyText(text:string,ok:string){
    const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); showToast(ok);
  }

  async function autoDetect(){
    if(hubClosed){ setMeasureMsg(t.hubClosedMeasure); return; }
    if(!canMeasure){
      const msg=`${t.calibNotPassed} ${calibReasons.join(', ')} - ${t.calibHint}`;
      setCalibFail(msg); setMeasureMsg(msg); playTing('fail'); return;
    }
    setCalibFail(''); setDetecting(true); setCalibProgress(0); setMeasureMsg(''); setDetectStep(lang==='id' ? 'Kalibrasi Ketat...' : 'STRICT CALIBRATION...');
    await new Promise<void>((resolve)=>{
      const started=Date.now();
      const iv=setInterval(()=>{
        const pct=Math.min(100, Math.round(((Date.now()-started)/2400)*100));
        setCalibProgress(pct);
        if(pct>=100){ clearInterval(iv); resolve(); }
      },100);
    });
    const still=calibRef.current;
    if(!still.centered || !still.light || !still.stable){
      const reasons:string[]=[];
      if(!still.centered) reasons.push(lang==='id' ? 'paket bergeser dari tengah' : 'package moved from center');
      if(!still.light) reasons.push(lang==='id' ? 'cahaya berubah / belum cukup' : 'light changed / not enough');
      if(!still.stable) reasons.push(lang==='id' ? 'ponsel bergerak saat kalibrasi' : 'phone moved during calibration');
      const msg=`${t.calibFailPrefix} ${reasons.join(', ')} - ${t.calibHint}`;
      setCalibFail(msg); setMeasureMsg(msg); setDetecting(false); setDetectStep(''); setCalibProgress(0); playTing('fail'); return;
    }
    setDetectStep(lang==='id' ? 'Mendeteksi…' : 'Detecting…');
    await new Promise(r=>setTimeout(r,500));
    const base:any={Kecil:{p:22,l:16,t:12},Sedang:{p:33,l:24,t:18},Besar:{p:54,l:39,t:34},Dus:{p:37,l:27,t:21},Karung:{p:44,l:31,t:27}};
    const b=base[autoJenis]||base.Sedang;
    const jitter=()=> (Math.random()*4-2);
    const rawP=Math.max(5,Math.round(b.p+jitter())); const rawL=Math.max(5,Math.round(b.l+jitter())); const rawT=Math.max(5,Math.round(b.t+jitter()));
    const aiP=Math.max(5,Math.round(rawP+calibration.dP)); const aiL=Math.max(5,Math.round(rawL+calibration.dL)); const aiT=Math.max(5,Math.round(rawT+calibration.dT));
    const aiB=r1(vol(aiP,aiL,aiT)+calibration.dBerat);
    setAiDims({p:aiP,l:aiL,t:aiT,berat:aiB}); setFinalDims({p:aiP,l:aiL,t:aiT}); setBerat(aiB); setManualWeight(false); setHasAI(true); setJenis(autoJenis);
    setDetecting(false); setDetectStep('');
    // (a) Measure success -> loud tone + vibration
    playTing('success'); doVibrate(60);
    showToast(`AI ${aiP} × ${aiL} × ${aiT} cm — ${aiB} Kg`);
  }
  function updateDim(key:'p'|'l'|'t',val:number){
    markInteract();
    const next={...finalDims,[key]:val}; setFinalDims(next); setHasAI(true); setJenis(inferJenis(next.p,next.l,next.t));
    if(!manualWeight) setBerat(r1(vol(next.p,next.l,next.t)+ (hasAI? calibration.dBerat:0)));
  }
  function scanResi(){
    markInteract();
    if(hubClosed){ setMeasureMsg(t.hubClosedScan); playTing('fail'); return; }
    const contoh=`JX${Math.floor(1000000000+Math.random()*8999999999)}`;
    setResi(contoh); showToast(`${t.scanResi} ${contoh}`); playTing('success'); doVibrate(60);
  }
  async function saveMeasure(){
    if(hubClosed){ setMeasureMsg(t.hubClosedMeasure); return; }
    if(!resi.trim()){ setMeasureMsg(t.saveFirst); playTing('fail'); return; }
    if(!session){ setMeasureMsg(t.sessionNotActive); return; }
    const now=new Date(); const iso=now.toISOString(); const dk=todayKey(now);
    const saveJenis = inferJenis(finalDims.p, finalDims.l, finalDims.t);
    const saveKondisi = kondisi;
    const pkg:Pkg={timestamp:iso,dateKey:dk,resi:resi.trim().toUpperCase(),berat,panjang:finalDims.p,lebar:finalDims.l,tinggi:finalDims.t,pengukur:session.nama,hub:session.hub,aiP:hasAI?aiDims.p:finalDims.p,aiL:hasAI?aiDims.l:finalDims.l,aiT:hasAI?aiDims.t:finalDims.t,aiBerat:hasAI?aiDims.berat:berat,kondisi:saveKondisi,jenis:saveJenis};
    const learn:Learn={timestamp:iso,hub:session.hub,aiP:pkg.aiP,aiL:pkg.aiL,aiT:pkg.aiT,aiBerat:pkg.aiBerat,fP:pkg.panjang,fL:pkg.lebar,fT:pkg.tinggi,fBerat:pkg.berat,dP:r1(pkg.panjang-pkg.aiP),dL:r1(pkg.lebar-pkg.aiL),dT:r1(pkg.tinggi-pkg.aiT),dBerat:r1(pkg.berat-pkg.aiBerat),kondisi:saveKondisi,jenis:saveJenis};
    setMeasureMsg(t.saving);
    try{
      await callApi("records.create",{collection:"appbulky_packages",value:pkg,idempotency_key:`pkg-${pkg.resi}-${Date.now()}`});
      try{ await callApi("records.create",{collection:"appbulky_learning",value:learn,idempotency_key:`learn-${pkg.resi}-${Date.now()}`}); }catch(_){}
      setBackend('Connected');
    }catch(e:any){
      setBackend(`Backend not available. ${e.message}`);
    }
    setPackages(prev=>[pkg,...prev]); setLearning(prev=>[learn,...prev]);
    playTing('success'); doVibrate(120);
    const newCount=todayPkgs.filter(p=>p.hub===session.hub).length+1;
    if(newCount%50===0){
      const totalB=r1(totalBerat+pkg.berat); const top=ranking[0]?.nama||session.nama;
      const notif:Notif={title:`${newCount} ${t.packagesBroke}`,body: lang==='id' ? `Hub ${session.hub} sudah mengukur ${newCount} paket hari ini! | Total Berat: ${totalB} Kg | Rata-rata: ${r1(totalB/newCount)} Kg/paket | Paling Rajin: ${top}` : `Hub ${session.hub} has measured ${newCount} packages today! | ${t.totalWeightLabel} ${totalB} Kg | ${t.avgLabel} ${r1(totalB/newCount)} Kg/package | ${t.mostActive} ${top}`,time:timeNow(),read:false,kind:'milestone'};
      setNotifs(prev=>[notif,...prev]);
      try{ await callApi("records.create",{collection:"appbulky_notifs",value:notif,idempotency_key:`notif-${newCount}-${dk}`}); }catch(_){}
      showToast(`${newCount} ${t.packagesBroke}`);
    } else {
      showToast(`${t.saved} ${pkg.resi} - ${pkg.berat} Kg`);
    }
    setSesi(s=>s+1); setResi(''); setHasAI(false); setManualWeight(false); setFinalDims({p:35,l:25,t:20}); setAiDims({p:35,l:25,t:20,berat:2.9}); setBerat(2.9); setMeasureMsg('');
  }
  function cancelMeasure(){ markInteract(); setResi(''); setHasAI(false); setManualWeight(false); setFinalDims({p:35,l:25,t:20}); setBerat(2.9); setMeasureMsg(''); showToast(t.cancelled); }

  function downloadCSV(rows:Pkg[],filename:string){
    const header='Tracking No,Weight,Length,Width,Height';
    const lines=rows.map(p=>`${p.resi},${p.berat},${p.panjang},${p.lebar},${p.tinggi}`);
    const blob=new Blob([[header,...lines].join('\n')],{type:'text/csv'}); const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
    showToast(`${t.downloadDone} ${rows.length} ${t.packages}`);
  }
  async function doClosing(){
    if(!session) return;
    const biggest=[...todayPkgs].sort((a,b)=>(b.panjang*b.lebar*b.tinggi)-(a.panjang*a.lebar*a.tinggi))[0];
    const body= lang==='id' ? `Penutupan Hub ${session.hub} - ${fmtDate()} | Total Paket: ${totalPaket} | Total Berat: ${totalBerat} Kg | Rata-rata Berat: ${avgBerat} Kg / paket | Rata-rata Ukuran: ${avgP} x ${avgL} x ${avgT} cm | Paket Terbesar: ${biggest?`${biggest.panjang} x ${biggest.lebar} x ${biggest.tinggi} - ${biggest.berat} Kg (Nomor Resi ${biggest.resi})`:''} | Peringkat: ${ranking.slice(0,3).map((r,i)=>`${i+1}. ${r.nama} - ${r.count} paket`).join(', ')} | Akurasi AI Hari Ini: ${accDim}% Dimensi, ${accBerat}% Berat` : `HUB CLOSING ${session.hub} - ${fmtDate()} | Total Packages: ${totalPaket} | Total Weight: ${totalBerat} Kg | Average Weight: ${avgBerat} Kg / package | Average Size: ${avgP} x ${avgL} x ${avgT} cm | Biggest Package: ${biggest?`${biggest.panjang} x ${biggest.lebar} x ${biggest.tinggi} - ${biggest.berat} Kg (Tracking No ${biggest.resi})`:''} | Ranking: ${ranking.slice(0,3).map((r,i)=>`${i+1}. ${r.nama} - ${r.count} packages`).join(', ')} | AI Accuracy Today: ${accDim}% Dimensions, ${accBerat}% Weight`;
    const notif:Notif={title: lang==='id' ? `Penutupan Hub ${session.hub} - ${fmtDate()}` : `HUB CLOSING ${session.hub} - ${fmtDate()}`,body,time:timeNow(),read:false,kind:'closing'};
    setNotifs(prev=>[notif,...prev]); setHubClosed(true); setShowClosingPrompt(false); setShowNotifs(true);
    try{ await callApi("records.create",{collection:"appbulky_notifs",value:notif,idempotency_key:`closing-${todayKey()}-${session.hub}`}); }catch(_){}
    await persistSettings({kode:session.kode,hub:session.hub,sheetId:session.sheetId,closingTime,members,hubClosed:true,gasUrl:session.gasUrl,closedDate:todayKey(),soundOn,vibrateOn});
    showToast(t.hubClosedDone);
  }
  async function openHub(){
    setHubClosed(false); setShowClosingPrompt(false);
    await persistSettings({kode:session?.kode,hub:session?.hub,sheetId:session?.sheetId,closingTime,members,hubClosed:false,gasUrl:session?.gasUrl,soundOn,vibrateOn});
    showToast(t.hubOpenedDone);
  }
  async function deletePackage(id?:string,resi?:string){
    if(!id) return; setPackages(prev=>prev.filter(p=>p._id!==id));
    try{ await callApi("records.delete",{collection:"appbulky_packages",id}); showToast(`${t.deleted} ${resi}`); }catch(e:any){ setStatusMsg(`Delete temporarily — ${e.message}`); }
  }
  async function resetDemo(){
    const seed=seedPackages(); setPackages(seed); setLearning(seedLearning(seed)); setNotifs([]); setSesi(0); setHubClosed(false);
    try{ const all=await callApi("records.list",{collection:"appbulky_packages",limit:100}); for(const r of all.records||[]){ await callApi("records.delete",{collection:"appbulky_packages",id:r.id}); } for(const row of seed){ await callApi("records.create",{collection:"appbulky_packages",value:row,idempotency_key:`reset-${row.resi}`}); } }catch(_){}
    showToast(t.resetDemo);
  }


  const brightness = kondisi==='Malam' ? 'brightness-[.55] contrast-110' : kondisi==='Remang-remang' ? 'brightness-75' : kondisi==='Backlight-Silau' ? 'brightness-125 contrast-125' : kondisi==='Lampu Kuning' ? 'brightness-105 sepia-[.35]' : kondisi==='Outdoor' ? 'brightness-110 saturate-125' : 'brightness-100';
  const dimsCorrected = hasAI && (aiDims.p!==finalDims.p||aiDims.l!==finalDims.l||aiDims.t!==finalDims.t);
  const dimsColor = dimsCorrected ? 'text-[#22C55E]' : 'text-white';
  const weightColor = manualWeight ? 'text-[#22C55E]' : 'text-white';

  const CalibPill=({ok}:{ok:boolean;label?:string})=>(
    <span aria-hidden="true" className={`inline-block w-2.5 h-2.5 rounded-full ${ok?'bg-[#22C55E]':'bg-[#EF4444]'}`} />
  );

  const renderSettingsPanel=()=>{
    if(!showSettings || !session) return null;
    const isAdmin=session.role==='Admin Hub';
    return (
      <div className="fixed inset-0 z-[70] bg-black/60 flex items-end sm:items-center justify-center p-3" onClick={()=>setShowSettings(false)} role="dialog" aria-modal="true" aria-label={t.settings}>
        <div className="card w-full max-w-[448px] max-h-[86vh] overflow-y-auto p-0 !rounded-[20px] fade-up" onClick={e=>e.stopPropagation()}>
          <div className="sticky top-0 z-10 bg-[var(--surface)] px-5 pt-5 pb-4 rounded-t-[20px] border-b border-[var(--line)]">
            <div className="relative flex items-center justify-center text-center">
              <h2 className="font-display text-[18px] font-bold tracking-[1px]">{t.settings}</h2>
              <button onClick={()=>setShowSettings(false)} className="absolute right-0 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] bg-[var(--surface-2)] text-[var(--ink)] border border-[var(--line)] rounded-xl flex items-center justify-center" aria-label={t.closeSettings}><X className="w-5 h-5"/></button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {/* LANGUAGE — at the very top */}
            <div className="border border-[var(--line)] rounded-2xl px-4 py-3.5 bg-[var(--surface-2)]">
              <p className="font-bold text-[15px] leading-tight">{t.language}</p>
              <div className="grid grid-cols-2 gap-2 mt-3" role="group" aria-label={t.language}>
                <button onClick={()=>saveLanguage('en')} aria-pressed={lang==='en'} className={`min-h-[48px] px-3 rounded-xl font-bold text-[14px] transition-colors ${lang==='en' ? 'bg-[#FF6B00] text-white' : 'bg-[#9CA3AF]/30 text-[var(--ink)]'}`}>{t.english}</button>
                <button onClick={()=>saveLanguage('id')} aria-pressed={lang==='id'} className={`min-h-[48px] px-3 rounded-xl font-bold text-[14px] transition-colors ${lang==='id' ? 'bg-[#FF6B00] text-white' : 'bg-[#9CA3AF]/30 text-[var(--ink)]'}`}>{t.indonesian}</button>
              </div>
            </div>
            {/* TING SOUND */}
            <div className="flex items-center justify-between gap-3 border border-[var(--line)] rounded-2xl px-4 py-3.5 bg-[var(--surface-2)]">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-[40px] h-[40px] min-w-[40px] min-h-[40px] rounded-full bg-[#FF6B00] text-white flex items-center justify-center shrink-0 text-[18px]">♪</span>
                <div className="min-w-0"><p className="font-bold text-[15px] leading-tight">{t.tingSound}</p><p className="text-[13px] font-medium" style={{color:'var(--muted)'}}>{soundOn ? t.tingOn : t.tingOff}</p></div>
              </div>
              <button onClick={()=>saveFeedback(!soundOn, vibrateOn)} aria-label={soundOn ? 'Turn off sound' : 'Turn on sound'} className={`relative shrink-0 w-[64px] h-[36px] rounded-full transition-colors ${soundOn ? 'bg-[#22C55E]' : 'bg-[var(--line)]'}`}>
                <span className={`absolute top-[4px] w-[28px] h-[28px] rounded-full bg-white shadow transition-all ${soundOn ? 'left-[32px]' : 'left-[4px]'}`} />
                <span className={`absolute top-1/2 -translate-y-1/2 text-[11px] font-bold text-white ${soundOn ? 'left-2' : 'right-2 text-[var(--ink)]'}`}>{soundOn ? 'ON' : 'OFF'}</span>
              </button>
            </div>
            <div className="flex items-center justify-between gap-3 border border-[var(--line)] rounded-2xl px-4 py-3.5 bg-[var(--surface-2)]">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-[40px] h-[40px] min-w-[40px] min-h-[40px] rounded-full bg-[#FF6B00] text-white flex items-center justify-center shrink-0"><Zap className="w-5 h-5"/></span>
                <div className="min-w-0"><p className="font-bold text-[15px] leading-tight">{t.vibration}</p><p className="text-[13px] font-medium" style={{color:'var(--muted)'}}>{vibrateOn ? t.vibOn : t.vibOff}</p></div>
              </div>
              <button onClick={()=>saveFeedback(soundOn, !vibrateOn)} aria-label={vibrateOn ? 'Turn off vibration' : 'Turn on vibration'} className={`relative shrink-0 w-[64px] h-[36px] rounded-full transition-colors ${vibrateOn ? 'bg-[#22C55E]' : 'bg-[var(--line)]'}`}>
                <span className={`absolute top-[4px] w-[28px] h-[28px] rounded-full bg-white shadow transition-all ${vibrateOn ? 'left-[32px]' : 'left-[4px]'}`} />
                <span className={`absolute top-1/2 -translate-y-1/2 text-[11px] font-bold text-white ${vibrateOn ? 'left-2' : 'right-2 text-[var(--ink)]'}`}>{vibrateOn ? 'ON' : 'OFF'}</span>
              </button>
            </div>
            <p className="text-[12px] font-medium px-1" style={{color:'var(--muted)'}}>{t.volumeNote}</p>
            {/* DARK MODE */}
            <div className="flex items-center justify-between gap-3 border border-[var(--line)] rounded-2xl px-4 py-3.5 bg-[var(--surface-2)]">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-[40px] h-[40px] min-w-[40px] min-h-[40px] rounded-full bg-[#FF6B00] text-white flex items-center justify-center shrink-0">{theme==='dark' ? <Moon className="w-5 h-5"/> : <Sun className="w-5 h-5"/>}</span>
                <div className="min-w-0"><p className="font-bold text-[15px] leading-tight">{t.darkMode}</p><p className="text-[13px] font-medium" style={{color:'var(--muted)'}}>{theme==='dark' ? t.darkOn : t.darkOff}</p></div>
              </div>
              <button onClick={toggleTheme} aria-label={theme==='dark' ? 'Switch to light mode' : 'Switch to dark mode'} className={`relative shrink-0 w-[56px] h-[32px] rounded-full transition-colors ${theme==='dark' ? 'bg-[#FF6B00]' : 'bg-[var(--line)]'}`}>
                <span className={`absolute top-[4px] w-[24px] h-[24px] rounded-full bg-white shadow transition-all ${theme==='dark' ? 'left-[28px]' : 'left-[4px]'}`} />
              </button>
            </div>
            {/* MORE DOWNLOADS */}
            <div className="border border-[var(--line)] rounded-2xl overflow-hidden">
              <button onClick={()=>setShowMoreDownload(v=>!v)} className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-[var(--surface-2)] text-left" aria-expanded={showMoreDownload}>
                <span className="flex items-center gap-3 min-w-0">
                  <span className="w-[40px] h-[40px] min-w-[40px] min-h-[40px] rounded-full bg-[#FF6B00] text-white flex items-center justify-center shrink-0"><Download className="w-5 h-5"/></span>
                  <span className="min-w-0"><span className="block font-bold text-[15px] leading-tight">{t.downloadMore}</span><span className="block text-[13px] font-medium" style={{color:'var(--muted)'}}>{t.downloadMoreDesc}</span></span>
                </span>
                <span className="font-bold text-[13px] shrink-0">{showMoreDownload ? '▲' : '▼'}</span>
              </button>
              {showMoreDownload && (
                <div className="px-4 pb-4 pt-1 space-y-3 border-t border-[var(--line)]">
                  <div><p className="font-bold text-sm">{t.dateRange}</p><div className="grid grid-cols-2 gap-2 mt-2"><input type="date" value={rangeStart} onChange={e=>setRangeStart(e.target.value)} className="field field-sm min-w-0"/><input type="date" value={rangeEnd} onChange={e=>setRangeEnd(e.target.value)} className="field field-sm min-w-0"/></div><button onClick={()=>downloadCSV(hubPackages.filter(p=>p.dateKey>=rangeStart&&p.dateKey<=rangeEnd),`appbulky-${rangeStart}-${rangeEnd}.csv`)} className="w-full min-h-[48px] px-4 bg-[var(--ink)] text-[var(--bg)] font-bold rounded-xl mt-2 text-[15px]">{t.downloadRange}</button></div>
                  <button onClick={()=>downloadCSV(hubPackages,`appbulky-semua.csv`)} className="w-full min-h-[48px] px-4 btn-outline text-[15px]">{t.downloadAll} ({hubPackages.length})</button>
                </div>
              )}
            </div>
            {/* TEMPLATE */}
            <button onClick={()=>{ setShowSettings(false); setView('template'); }} className="w-full flex items-center justify-between gap-3 border border-[var(--line)] rounded-2xl px-4 py-3.5 bg-[var(--surface-2)] text-left">
              <span className="flex items-center gap-3 min-w-0">
                <span className="w-[40px] h-[40px] min-w-[40px] min-h-[40px] rounded-full bg-[#FF6B00] text-white flex items-center justify-center shrink-0"><BookOpen className="w-5 h-5"/></span>
                <span className="min-w-0"><span className="block font-bold text-[15px] leading-tight">{t.template}</span><span className="block text-[13px] font-medium" style={{color:'var(--muted)'}}>{t.templateDesc}</span></span>
              </span>
              <span className="font-bold text-lg shrink-0">→</span>
            </button>
            {isAdmin ? (
              <div className="pt-1 space-y-4">
                <div className="divider" />
                <p className="label-caps">{t.adminHub}</p>
                <section className="space-y-4">
                  <h3 className="font-bold">{t.hubClosing}</h3>
                  <label className="block"><span className="label-caps">{t.hubLabel}</span><input value={hubInput} onChange={e=>setHubInput(e.target.value)} className="field mt-2"/></label>
                  <label className="block"><span className="label-caps">{t.closingTime}</span><input type="time" value={closingTime} onChange={e=>setClosingTime(e.target.value)} className="field mt-2"/></label>
                  <label className="block"><span className="label-caps">{t.gasUrlLabel}</span><input value={gasUrl} onChange={e=>setGasUrl(e.target.value)} placeholder={t.gasUrlLabel} className="field mt-2"/><input value={session.sheetId} readOnly className="field mt-2 opacity-70"/></label>
                  <label className="block"><span className="label-caps">{t.codeHubLabel}</span><input value={kode} onChange={e=>setKode(e.target.value)} className="field mt-2 uppercase"/></label>
                  <button onClick={async()=>{ await persistSettings({kode,hub:hubInput,sheetId:session.sheetId,closingTime,members,hubClosed,gasUrl,soundOn,vibrateOn}); setSession({...session,hub:hubInput,gasUrl}); showToast(t.settingsSaved); }} className="w-full min-h-[48px] px-4 bg-[#FF6B00] text-white font-bold rounded-xl text-[15px]">{t.saveSettings}</button>
                  <div className="grid grid-cols-2 gap-2"><button onClick={doClosing} className="min-h-[48px] px-2 bg-[#EF4444] text-white font-bold rounded-xl text-sm">{t.closeHub}</button><button onClick={openHub} className="min-h-[48px] px-2 bg-[#22C55E] text-white font-bold rounded-xl text-sm">{t.openHub}</button></div>
                  <p className="text-sm font-semibold">{t.hubStatus} {hubClosed? t.hubClosed : t.hubOpen}</p>
                </section>
                <section><h3 className="font-bold flex items-center gap-2"><Users className="w-5 h-5 text-[#FF6B00]"/> {t.members}</h3><div className="flex flex-wrap gap-2 mt-3">{members.map(m=><span key={m} className="bg-[var(--surface-2)] border border-[var(--line)] px-3 py-1.5 rounded-full font-semibold text-sm flex items-center gap-1.5 max-w-full"><span className="truncate">{m}</span><button onClick={()=>setMembers(members.filter(x=>x!==m))} className="font-bold shrink-0">×</button></span>)}</div><div className="flex gap-2 mt-3"><input value={newMember} onChange={e=>setNewMember(e.target.value)} placeholder={t.newMemberPh} className="field flex-1 min-w-0"/><button onClick={()=>{ if(newMember.trim()){ setMembers([...members,newMember.trim()]); setNewMember(''); showToast(`${newMember.trim()} ${t.memberAdded}`); } }} className="min-h-[48px] px-4 bg-[var(--ink)] text-[var(--bg)] font-bold rounded-xl shrink-0 text-sm">{t.add}</button></div></section>
                <section><h3 className="font-bold">{t.aiAccuracy}</h3><p className="text-sm font-medium mt-2">{t.dimension}: {accDim}% • {t.weight}: {accBerat}%</p><p className="text-sm font-medium mt-1">{t.corrections}: {learning.filter(l=>l.hub===session.hub).length}</p><button onClick={()=>{ setShowAHS(true); }} className="mt-3 min-h-[48px] px-4 btn-outline font-bold rounded-xl text-sm">{t.viewLearning}</button>{showAHS && <div className="mt-3 overflow-x-auto max-h-[300px] overflow-y-auto border border-[var(--line)] rounded-xl"><table className="w-full text-[11px] font-medium"><thead><tr className="bg-[#FF6B00] text-white"><th className="p-2 text-left">Time</th><th className="p-2 text-left">AI L×W×H</th><th className="p-2 text-left">Final L×W×H</th><th className="p-2 text-left">AI Weight</th><th className="p-2 text-left">Final Weight</th><th className="p-2 text-left">Diff</th></tr></thead><tbody>{learning.slice(0,30).map((l,i)=><tr key={i} className="border-t border-[var(--line)]"><td className="p-2">{l.timestamp.slice(11,16)}</td><td className="p-2">{l.aiP}×{l.aiL}×{l.aiT}</td><td className="p-2">{l.fP}×{l.fL}×{l.fT}</td><td className="p-2">{l.aiBerat}</td><td className="p-2">{l.fBerat}</td><td className="p-2">{l.dP}/{l.dBerat}</td></tr>)}</tbody></table></div>}</section>
                <section><h3 className="font-bold">{t.deleteData}</h3><div className="space-y-2 mt-3 max-h-[260px] overflow-y-auto">{todayPkgs.map(p=><div key={p._id||p.resi} className="flex items-center justify-between gap-2 border border-[var(--line)] rounded-xl px-3 py-2.5"><span className="font-semibold text-sm truncate min-w-0">{p.resi} — {p.berat} Kg</span><button onClick={()=>deletePackage(p._id,p.resi)} className="min-h-[40px] px-3 bg-[#EF4444] text-white font-bold rounded-lg flex items-center gap-1 text-sm shrink-0"><Trash2 className="w-4 h-4"/> {t.deleteBtn}</button></div>)}</div></section>
                <button onClick={resetDemo} className="w-full min-h-[48px] px-2 btn-outline text-[15px]">{t.resetDemo}</button>
              </div>
            ) : (
              <div className="pt-1"><div className="divider" /><p className="text-sm font-medium pt-3" style={{color:'var(--muted)'}}>{t.adminOnly}</p></div>
            )}
            <button onClick={()=>{ setShowSettings(false); setSession(null); setView('login'); }} className="w-full min-h-[48px] px-4 btn-outline text-[15px]">{t.logout}</button>
            {toast && <p className="toast-anim bg-[var(--ink)] text-[var(--bg)] font-bold px-3 py-2.5 rounded-xl text-center text-sm">{toast}</p>}
          </div>
        </div>
      </div>
    );
  };

  const renderNotifs=()=> showNotifs && (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center p-3" onClick={()=>setShowNotifs(false)}><div className="card w-full max-w-[448px] max-h-[80vh] overflow-y-auto p-0 !rounded-[20px]" onClick={e=>e.stopPropagation()}><div className="bg-[#FF6B00] px-5 pt-5 pb-4 rounded-t-[20px]"><div className="relative flex flex-col items-center justify-center text-center"><button onClick={()=>setShowNotifs(false)} className="absolute right-0 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] bg-black text-white rounded-xl flex items-center justify-center"><X/></button><h2 className="font-display text-[18px] font-bold tracking-[1px] flex items-center justify-center gap-2 mt-1 text-white"><Bell/> {t.notifications}</h2></div></div><div className="p-4">{notifs.length===0? <p className="font-medium mt-1 text-sm">{t.noNotif}</p>: notifs.map((n,i)=>(<div key={i} className="border border-[var(--line)] rounded-xl p-3.5 mt-3"><p className="font-bold break-words">{n.title}</p><p className="text-sm font-medium mt-1 leading-relaxed break-words">{n.body}</p><p className="text-sm mt-2">{n.time}</p></div>))}<button onClick={()=>setNotifs([])} className="w-full min-h-[48px] px-4 btn-outline mt-4 text-[15px]">{t.deleteAll}</button></div></div></div>
  );

  if(!loaded) return <div className="min-h-[100dvh] bg-[var(--bg)] flex flex-col items-center justify-center px-4 py-6 gap-4"><HeaderOne session={null}/></div>;

  // ============ MEASURE ============
  if(view==='measure' && session){
    return (
      <div ref={containerRef} className={isFullscreen ? "ukur is-fullscreen" : "ukur"}>
        <header className="ukur-top" style={{display:'flex',flexDirection:'column',justifyContent:'center',gap:6}}>
          <div className="flex items-center w-full" style={{gap:8}}>
            <button onClick={()=>setView('dashboard')} className="min-h-[40px] px-3 bg-black/55 text-white font-bold rounded-full flex items-center justify-center gap-1 text-[13px] shrink-0 border border-white/25 whitespace-nowrap" style={{flex:'none'}}><ArrowLeft className="w-4 h-4"/> {t.back}</button>
            <span className="font-display font-bold text-white text-center leading-tight" style={{flex:'1 1 auto',minWidth:0,fontSize:14,letterSpacing:1}}>{t.measurePackage}</span>
            <span aria-hidden="true" className="shrink-0" style={{flex:'none',width:86}} />
          </div>
          <div className="flex items-center justify-center w-full">
            <span key={sesi} className="pop-anim inline-flex items-center justify-center min-h-[26px] px-3 text-white font-bold whitespace-nowrap bg-black/55 rounded-full" style={{fontSize:11,maxWidth:'100%'}}>{t.sessionLabel}: {sesi} {t.packages}</span>
          </div>
        </header>

        <div className="cam">
          <video ref={videoRef} autoPlay playsInline muted className={brightness} style={{display:'block',width:'100%',height:'100%',objectFit:'cover',background:'#000'}} />
          <div className="cam-guide" aria-hidden="true" />
          {camError ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/70 px-6 text-center">
              <p className="text-white font-bold text-[14px] leading-snug">{camError}</p>
              <button onClick={()=>void startCamera()} className="min-h-[48px] px-5 bg-[#FF6B00] text-white font-bold rounded-full text-[13px]">{lang==='id' ? 'COBA LAGI' : 'RETRY CAMERA'}</button>
            </div>
          ) : camMsg ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/45 pointer-events-none"><p className="text-white font-bold text-[13px] bg-black/60 px-4 py-2 rounded-full">{camMsg}</p></div>
          ) : null}
          {isFullscreen && (
            <div className="absolute inset-x-0 z-20 flex flex-col gap-2 px-3" style={{bottom:58,pointerEvents:'none'}}>
              <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-black/45 px-3 py-2" style={{backdropFilter:'blur(6px)',pointerEvents:'auto'}}>
                <div className="min-w-0"><p className="label-caps" style={{color:'rgba(255,255,255,.75)',fontSize:10}}>{t.dimensions}</p><p className={`font-display font-bold leading-none mt-1 ${dimsColor}`} style={{fontSize:20}}>{finalDims.p} <span className="text-[#FF6B00]">×</span> {finalDims.l} <span className="text-[#FF6B00]">×</span> {finalDims.t} <span className="text-[11px]">cm</span></p></div>
                <div className="text-right shrink-0"><p className="label-caps" style={{color:'rgba(255,255,255,.75)',fontSize:10}}>{t.weightLabel}</p><p className={`font-display font-bold leading-none mt-1 ${weightColor}`} style={{fontSize:20}}>{berat.toFixed(1)} <span className="text-[11px]">Kg</span></p></div>
              </div>
              <div className="flex gap-2" style={{pointerEvents:'auto'}}>
                <button onClick={toggleFlash} aria-pressed={flashOn} className="min-h-[48px] px-3 rounded-xl font-bold uppercase flex items-center justify-center gap-1.5 text-[11px] leading-tight border" style={{flex:'1 1 40%',background: flashOn ? '#FFC107' : 'rgba(0,0,0,.55)', color: flashOn ? '#111111' : '#FFFFFF', borderColor: flashOn ? '#FFC107' : 'rgba(255,255,255,.3)', backdropFilter:'blur(6px)', boxShadow: flashOn ? '0 0 18px rgba(255,193,7,.85)' : 'none'}}>{flashOn ? <Flashlight className="w-4 h-4 shrink-0" /> : <FlashlightOff className="w-4 h-4 shrink-0" />}<span>{flashOn ? t.flashTurnOff : t.flashTurnOn}</span></button>
                <button onClick={autoDetect} disabled={!canMeasure||detecting} className="bg-[#FF6B00] text-white rounded-xl font-display font-bold tracking-[1px] disabled:opacity-40 flex items-center justify-center gap-2" style={{flex:'1 1 60%',minHeight:48,fontSize:15}}><Play className="w-4 h-4 shrink-0"/> {t.startMeasure}</button>
              </div>
            </div>
          )}
          <button onClick={toggleFullscreen} aria-label={isFullscreen ? t.exitFullScreen : t.fullScreen} className="absolute z-20 min-h-[40px] px-3.5 bg-black/60 text-white font-bold rounded-full flex items-center gap-1.5 text-[12px] border border-white/20 active:scale-95" style={{bottom:10,right:10}}><Maximize2 className="w-4 h-4"/>{isFullscreen ? t.exitFullScreen : t.fullScreen}</button>
        </div>

        <div className="panel">
          <div className="panel-sticky flex flex-col" style={{gap:12}}>
            <div className="flex gap-1.5 justify-start" aria-hidden="true"><CalibPill ok={calibCentered}/><CalibPill ok={calibLight}/><CalibPill ok={calibStable}/></div>
            <div className="flex" style={{gap:12}}>
              <button onClick={toggleFlash} aria-pressed={flashOn} aria-label={flashOn ? t.flashTurnOff : t.flashTurnOn} className="min-h-[52px] px-3 rounded-xl font-bold uppercase flex items-center justify-center gap-1.5 text-[12px] leading-tight border transition-all" style={{height:52,flex:'0 0 40%',background: flashOn ? '#FFC107' : '#3A3A3A', color: flashOn ? '#111111' : '#FFFFFF', borderColor: flashOn ? '#FFC107' : 'rgba(255,255,255,.25)', boxShadow: flashOn ? '0 0 18px rgba(255,193,7,.85), 0 0 32px rgba(255,193,7,.45)' : 'none'}}>{flashOn ? <Flashlight className="w-5 h-5 shrink-0" /> : <FlashlightOff className="w-5 h-5 shrink-0" />}<span className="text-center">{flashOn ? t.flashTurnOff : t.flashTurnOn}</span></button>
              <button onClick={autoDetect} disabled={!canMeasure||detecting} className="bg-[#FF6B00] text-white rounded-xl font-display font-bold tracking-[1px] disabled:opacity-40 disabled:grayscale flex items-center justify-center gap-2" style={{height:52,flex:'1 1 60%',fontSize:18}}><Play className="w-5 h-5 shrink-0"/> {t.startMeasure}</button>
            </div>
            {flashError && <p className="text-[12px] font-semibold text-[#FFC107] mt-2">{flashError}</p>}
          </div>
          <div className="flex flex-col" style={{gap:12}}>
            <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3" style={{gap:10}}>
              <div className="min-w-0"><p className="label-caps" style={{color:'rgba(255,255,255,.72)'}}>{t.dimensions}</p><p className={`font-display font-bold leading-none mt-2 ${dimsColor}`} style={{fontSize:32}}>{finalDims.p} <span className="text-[#FF6B00]">×</span> {finalDims.l} <span className="text-[#FF6B00]">×</span> {finalDims.t} <span className="text-sm font-bold">cm</span></p></div>
              <div className="text-right shrink-0"><p className="label-caps" style={{color:'rgba(255,255,255,.72)'}}>{t.weightLabel}</p><p className={`font-display font-bold leading-none mt-2 ${weightColor}`} style={{fontSize:32}}>{berat.toFixed(1)} <span className="text-base">Kg</span></p></div>
            </div>

            <div>
              <label className="label-caps" style={{color:'rgba(255,255,255,.72)'}}>{t.trackingNo}</label>
              <div className="flex mt-2" style={{gap:12}}><input value={resi} onChange={e=>{setResi(e.target.value); markInteract();}} placeholder={lang==='id' ? 'Nomor Resi / Tracking No.' : 'Tracking No. / Nomor Resi'} inputMode="text" className="flex-1 min-w-0 min-h-[52px] bg-[#2A2A2A] border border-white/20 rounded-xl px-3.5 font-bold text-[15px] uppercase text-white outline-none focus:border-[#FF6B00]" style={{height:52}}/><button onClick={scanResi} className="min-h-[52px] px-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-1.5 text-sm shrink-0" style={{width:110,height:52}}><Camera className="w-5 h-5"/> {t.scan}</button></div>
              {resi && <div className="mt-2 inline-flex items-center gap-2 bg-[#FF6B00] text-white rounded-full px-3 py-1.5 text-[12px] font-bold max-w-full"><span className="truncate">{resi.toUpperCase()}</span></div>}
            </div>

            <div className="grid grid-cols-2" style={{gap:12}}>
              <label className="block min-w-0"><span className="label-caps" style={{color:'rgba(255,255,255,.72)'}}>{t.length}</span><input type="number" inputMode="decimal" min={1} max={200} value={finalDims.p} onChange={e=>updateDim('p', Number(e.target.value)||1)} className="w-full min-h-[52px] bg-[#2A2A2A] border border-white/20 rounded-xl px-3 font-bold text-white outline-none focus:border-[#FF6B00] mt-2" style={{fontSize:20}}/></label>
              <label className="block min-w-0"><span className="label-caps" style={{color:'rgba(255,255,255,.72)'}}>{t.width}</span><input type="number" inputMode="decimal" min={1} max={200} value={finalDims.l} onChange={e=>updateDim('l', Number(e.target.value)||1)} className="w-full min-h-[52px] bg-[#2A2A2A] border border-white/20 rounded-xl px-3 font-bold text-white outline-none focus:border-[#FF6B00] mt-2" style={{fontSize:20}}/></label>
              <label className="block min-w-0"><span className="label-caps" style={{color:'rgba(255,255,255,.72)'}}>{t.height}</span><input type="number" inputMode="decimal" min={1} max={200} value={finalDims.t} onChange={e=>updateDim('t', Number(e.target.value)||1)} className="w-full min-h-[52px] bg-[#2A2A2A] border border-white/20 rounded-xl px-3 font-bold text-white outline-none focus:border-[#FF6B00] mt-2" style={{fontSize:20}}/></label>
              <label className="block min-w-0"><span className="label-caps" style={{color:'rgba(255,255,255,.72)'}}>{t.weightField}</span><input type="number" inputMode="decimal" min={0.1} max={100} step={0.1} value={berat} onChange={e=>{markInteract(); setBerat(Number(e.target.value)||0.1); setManualWeight(true);}} className="w-full min-h-[52px] bg-[#2A2A2A] border border-white/20 rounded-xl px-3 font-bold text-white outline-none focus:border-[#FF6B00] mt-2" style={{fontSize:20}}/></label>
            </div>

            <button onClick={saveMeasure} disabled={hubClosed} className="w-full bg-[#FF6B00] text-white rounded-xl font-display font-bold tracking-[1px] disabled:opacity-40 transition-transform duration-200 ease-out active:scale-[0.99]" style={{height:56,fontSize:20}}>{t.save}</button>
            <div className="grid grid-cols-1 pb-2" style={{gap:12}}>
              <button onClick={cancelMeasure} className="min-h-[48px] px-2 bg-white/10 border border-white/20 text-white font-bold rounded-xl text-[13px]">{t.cancel}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ LOGIN ============
  if(view==='login' || !session){
    return (
      <div className="min-h-[100dvh] bg-[var(--bg)] text-[var(--ink)] overflow-x-clip">
        <div className="px-4"><div style={{marginTop:12}}><HeaderOne session={null}/></div></div>
        <div className="px-4 pt-3 pb-6">
          <form onSubmit={doLogin} className="card p-4 space-y-4">
            <h2 className="font-display text-[18px] font-bold tracking-[1px]">{t.activation}</h2>
            {loginError && <div className="bg-[#EF4444]/10 border border-[#EF4444] text-[#EF4444] font-semibold rounded-xl px-3 py-2.5 text-sm">{loginError}</div>}
            <label className="block"><span className="label-caps">{t.hubCode}</span><input value={kode} onChange={e=>setKode(e.target.value)} placeholder="LOSARI-2026" className="field mt-2 uppercase"/></label>
            <label className="block"><span className="label-caps">{t.sheetLink}</span><input value={sheetInput} onChange={e=>setSheetInput(e.target.value)} placeholder={t.sheetLink} className="field mt-2"/></label>
            <label className="block"><span className="label-caps">{t.measurerName}</span><input value={nama} onChange={e=>setNama(e.target.value)} placeholder={t.measurerName} className="field mt-2"/></label>
            <label className="block"><span className="label-caps">{t.hubName}</span><input value={hubInput} onChange={e=>setHubInput(e.target.value)} placeholder="Hub Losari" className="field mt-2"/></label>
            <label className="block"><span className="label-caps">{t.role}</span><select value={role} onChange={e=>setRole(e.target.value as Role)} className="field mt-2"><option>Hub Member</option><option>Admin Hub</option></select></label>
            <label className="block"><span className="label-caps">{t.gasUrl}</span><input value={gasUrl} onChange={e=>setGasUrl(e.target.value)} placeholder={t.gasUrl} className="field mt-2"/></label>
            <button disabled={loginBusy} className="w-full min-h-[48px] px-4 bg-[#FF6B00] text-white font-display text-[18px] font-bold tracking-[1px] rounded-xl">{t.activateEnter}</button>
            <button type="button" onClick={demoLogin} className="w-full min-h-[48px] px-4 bg-[var(--ink)] text-[var(--bg)] font-bold rounded-xl text-[15px]">{t.demo}</button>
            {toast && <p className="toast-anim bg-[var(--ink)] text-[var(--bg)] font-bold px-3 py-2.5 rounded-xl text-center text-sm">{toast}</p>}
          </form>
        </div>
      </div>
    );
  }

  // ============ TEMPLATE ============
  if(view==='template'){
    return (
      <div className="min-h-[100dvh] bg-[var(--bg)] text-[var(--ink)] overflow-x-clip pb-[110px]">
        <div className="px-4">
          <StackedHeaders session={session} unread={unread} onNotif={openNotifs} onSettings={openSettings}/>
          <div className="flex items-center justify-between py-3"><button onClick={()=>setView('dashboard')} className="min-h-[40px] px-3 bg-black text-white font-bold rounded-full text-[13px]">← {t.dashboard}</button><h1 className="font-display text-[17px] font-bold tracking-[1px] text-center m-0 leading-[1.2]">{t.templateTitle}</h1><span className="w-[88px]" /></div>
          <div className="space-y-3">
            <section className="card p-4"><div className="flex justify-between items-start gap-3"><h2 className="font-bold text-base">Data_Ukur</h2><button onClick={()=>copyText('Timestamp | Tracking No | Weight (Kg) | Length | Width | Height | Measurer Name | Hub Name',t.copied)} className="min-h-[40px] px-3 bg-[#FF6B00] text-white font-bold rounded-lg text-sm flex items-center gap-1.5 shrink-0"><Copy className="w-4 h-4"/> {t.copyHeader}</button></div><div className="overflow-x-auto mt-3"><table className="w-full text-xs font-semibold"><thead><tr className="bg-[#FF6B00] text-white"><th className="p-2.5 text-left rounded-l-lg">Timestamp</th><th className="p-2.5 text-left">Tracking No</th><th className="p-2.5 text-left">Weight (Kg)</th><th className="p-2.5 text-left">Length</th><th className="p-2.5 text-left">Width</th><th className="p-2.5 text-left">Height</th><th className="p-2.5 text-left">Measurer Name</th><th className="p-2.5 text-left rounded-r-lg">Hub Name</th></tr></thead></table></div></section>
            <section className="card p-4"><div className="flex justify-between items-start gap-3"><h2 className="font-bold text-base">AI_Learning</h2><button onClick={()=>copyText('Timestamp | Hub Name | AI_Length | AI_Width | AI_Height | AI_Weight | Final_Length | Final_Width | Final_Height | Final_Weight | Diff_Length | Diff_Width | Diff_Height | Diff_Weight | Light Condition',t.copied)} className="min-h-[40px] px-3 bg-[#FF6B00] text-white font-bold rounded-lg text-sm flex items-center gap-1.5 shrink-0"><Copy className="w-4 h-4"/> {t.copyHeader}</button></div><p className="text-sm font-medium mt-3 break-words">Timestamp | Hub Name | AI_Length | AI_Width | AI_Height | AI_Weight | Final_Length | Final_Width | Final_Height | Final_Weight | Diff_Length | Diff_Width | Diff_Height | Diff_Weight | Light Condition</p></section>
            <section className="card p-4"><div className="flex justify-between items-start gap-3"><h2 className="font-bold text-base">Setting_Hub</h2><button onClick={()=>copyText('Hub_Code | Hub_Name | Sheet_ID | Closing_Time | Status',t.copied)} className="min-h-[40px] px-3 bg-[#FF6B00] text-white font-bold rounded-lg text-sm flex items-center gap-1.5 shrink-0"><Copy className="w-4 h-4"/> {t.copyHeader}</button></div><p className="text-sm font-medium mt-3 break-words">Hub_Code | Hub_Name | Sheet_ID | Closing_Time | Status</p></section>
            {toast && <p className="mt-3 bg-[var(--ink)] text-[var(--bg)] font-bold px-3 py-2 rounded-lg text-sm">{toast}</p>}
          </div>
        </div>
        <FloatingMeasure onMeasure={openMeasure} hubClosed={hubClosed} label={lang==='id' ? 'UKUR' : 'MEASURE'}/>
        {renderNotifs()}
        {renderSettingsPanel()}
      </div>
    );
  }

  // ============ DASHBOARD ============
  return (
    <div className="min-h-[100dvh] bg-[var(--bg)] text-[var(--ink)] overflow-x-clip pb-[110px]">
      <div className="px-4">
        <StackedHeaders session={session} unread={unread} onNotif={openNotifs} onSettings={openSettings}/>
        {hubClosed && <div className="mt-3 bg-black/70 border border-white/20 rounded-xl px-3 py-2.5 font-bold text-sm text-center text-white">{t.hubClosedBanner}</div>}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="card p-[14px] flex flex-col justify-between" style={{height:110,borderRadius:16}}><div className="flex justify-between items-start gap-2"><p className="label-caps">{t.totalPackages}</p><Package className="w-4 h-4 text-[#FF6B00] shrink-0"/></div><p className="font-display text-[26px] leading-none font-bold tracking-[1px]">{totalPaket}</p></div>
          <div className="card p-[14px] flex flex-col justify-between" style={{height:110,borderRadius:16}}><div className="flex justify-between items-start gap-2"><p className="label-caps">{t.totalWeight}</p><Scale className="w-4 h-4 text-[#FF6B00] shrink-0"/></div><p className="font-display text-[26px] leading-none font-bold tracking-[1px]">{totalBerat} <span className="text-[16px]">Kg</span></p></div>
          <div className="card p-[14px] flex flex-col justify-between" style={{height:110,borderRadius:16}}><div className="flex justify-between items-start gap-2"><p className="label-caps">{t.avgWeight}</p><Scale className="w-4 h-4 text-[#FF6B00] shrink-0"/></div><p className="font-display text-[26px] leading-none font-bold tracking-[1px]">{avgBerat} <span className="text-[16px]">Kg</span></p></div>
          <div className="card p-[14px] flex flex-col justify-between" style={{height:110,borderRadius:16}}><div className="flex justify-between items-start gap-2"><p className="label-caps">{t.avgSize}</p><Ruler className="w-4 h-4 text-[#FF6B00] shrink-0"/></div><p className="font-display leading-none font-bold tracking-[1px] break-words" style={{fontSize:22}}>{avgP} × {avgL} × {avgT} <span className="text-[13px]">cm</span></p></div>
          <div className="card p-[14px] flex flex-col justify-between" style={{height:110,borderRadius:16}}><div className="flex justify-between items-start gap-2"><p className="label-caps">{t.aiDimAcc}</p><Sparkles className="w-4 h-4 text-[#FF6B00] shrink-0"/></div><p className="font-display text-[26px] leading-none font-bold tracking-[1px]">{accDim}%</p></div>
          <div className="card p-[14px] flex flex-col justify-between" style={{height:110,borderRadius:16}}><div className="flex justify-between items-start gap-2"><p className="label-caps">{t.aiWeightAcc}</p><Sparkles className="w-4 h-4 text-[#FF6B00] shrink-0"/></div><p className="font-display text-[26px] leading-none font-bold tracking-[1px]">{accBerat}%</p></div>
        </div>
        <section className="card p-4 mt-3" style={{borderRadius:18}}><h2 className="font-display text-[18px] font-bold tracking-[1px]">{t.sevenDay}</h2><div className="flex items-end gap-2 h-[140px] mt-4">{chart.map((c,i)=>(<button key={i} onClick={()=>showToast(`${c.date}: ${c.count} ${t.packages} • ${c.berat} Kg`)} className="flex-1 flex flex-col items-center justify-end h-full min-w-0"><span className="text-[11px] font-bold">{c.count}</span><div className="w-full rounded-t-lg bg-[var(--surface-2)] flex items-end justify-center overflow-hidden" style={{height:`${Math.max(14,(c.count/maxChart)*100)}%`}}><div className="w-full bg-[#FF6B00] rounded-t-lg" style={{height:'100%'}}/></div><span className="text-[10px] font-medium mt-1.5" style={{color:'var(--muted)'}}>{c.label}</span></button>))}</div></section>
        <section className="card p-4 mt-3" style={{borderRadius:18}}><h2 className="font-display text-[18px] font-bold tracking-[1px]">{t.download}</h2><button onClick={()=>downloadCSV(todayPkgs,`appbulky-${todayKey()}.csv`)} className="w-full min-h-[52px] px-4 bg-[#FF6B00] text-white font-display text-[17px] font-bold tracking-[1px] rounded-xl mt-4 flex items-center justify-center gap-2"><Download className="w-5 h-5"/> {t.download}</button></section>
        {toast && <p className="toast-anim mt-3 bg-[var(--ink)] text-[var(--bg)] font-bold px-3 py-2.5 rounded-xl text-center text-sm">{toast}</p>}
        {statusMsg && <p className="mt-3 bg-[var(--ink)] text-[var(--bg)] font-bold px-3 py-2.5 rounded-xl text-center text-sm">{statusMsg}</p>}
      </div>
      <FloatingMeasure onMeasure={openMeasure} hubClosed={hubClosed} label={lang==='id' ? 'UKUR' : 'MEASURE'}/>
      {renderNotifs()}
      {renderSettingsPanel()}
      {showClosingPrompt && <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4"><div className="card w-full max-w-[448px] p-4 !rounded-[20px]"><h2 className="font-display text-[18px] font-bold tracking-[1px]">{t.closing}</h2><p className="font-medium mt-2 text-sm leading-relaxed break-words">{closingTime}</p><div className="grid grid-cols-2 gap-2 mt-4"><button onClick={()=>{ const d=new Date(); d.setHours(d.getHours()+1); setSnoozeUntil(`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`); setShowClosingPrompt(false); showToast(t.closingSnoozed); }} className="min-h-[48px] px-2 btn-outline font-bold rounded-xl flex items-center justify-center gap-1.5 text-sm"><Clock className="w-5 h-5"/> {t.snooze}</button><button onClick={doClosing} className="min-h-[48px] px-2 bg-[#EF4444] text-white font-bold rounded-xl text-sm">{t.closeNow}</button></div></div></div>}
    </div>
  );
}

export default function App(){
  return (
    <div data-safe-area-inset-root style={{boxSizing:'border-box',paddingTop:'var(--safe-area-inset-top)'}} className="min-h-[100dvh] bg-[var(--bg)] overflow-x-clip">
      <div className="mx-auto w-full max-w-[480px] min-h-[100dvh] bg-[var(--bg)] box-border overflow-x-clip">
        <Inner/>
      </div>
    </div>
  );
}
