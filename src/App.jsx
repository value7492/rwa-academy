import { useState, useEffect, useMemo } from "react";

const C = {
  bg:"#0A0912",bg2:"#100E1C",card:"#181527",card2:"#1F1B30",
  border:"rgba(255,255,255,0.08)",borderStrong:"rgba(255,255,255,0.14)",
  purple:"#8B6CFF",purpleDeep:"#5B3FCC",gold:"#E6B95C",goldDeep:"#B8862F",
  up:"#3DDC97",down:"#FF6B81",text:"#ECEAF7",muted:"#928CB0",faint:"#5F5980",
};
const FONT=`@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Spline+Sans:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');
*{-webkit-tap-highlight-color:transparent;box-sizing:border-box;}
.sc::-webkit-scrollbar{width:0;height:0;}
@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`;
const D={fontFamily:"'Bricolage Grotesque',sans-serif"};
const B={fontFamily:"'Spline Sans',sans-serif"};
const M={fontFamily:"'Space Mono',monospace"};

const PI_USD=0.144;
const ASSETS=[
  {id:"ustb",sym:"USTB",name:"美 단기국채 토큰",cls:"국채",icon:"🏛️",price:1.0021,chg:0.04,vol:0.004,blurb:"미국 단기 국채(T-Bill)에 연동되도록 설계된 토큰화 자산.",facts:["기초자산: 美 단기국채","연동 지수 변동성: 매우 낮음","발행 네트워크: Stellar"]},
  {id:"xau",sym:"tXAU",name:"금 연동 토큰",cls:"귀금속",icon:"🪙",price:76.42,chg:0.71,vol:0.012,blurb:"금 1g에 연동되도록 설계된 토큰. 인플레이션 헤지 수단으로 거론됩니다.",facts:["기초자산: 금(Gold)","연동 지수 변동성: 보통","발행 네트워크: Stellar"]},
  {id:"btx",sym:"tBLUE",name:"블루칩 주식 바스켓",cls:"주식",icon:"📈",price:42.18,chg:-1.23,vol:0.03,blurb:"글로벌 우량주 바스켓에 연동되도록 설계된 토큰.",facts:["기초자산: 우량주 바스켓","연동 지수 변동성: 높음","발행 네트워크: Stellar"]},
  {id:"mmf",sym:"tMMF",name:"머니마켓 토큰",cls:"현금성",icon:"💵",price:1.0008,chg:0.01,vol:0.002,blurb:"단기 우량 채권 중심의 머니마켓에 연동되도록 설계된 토큰.",facts:["기초자산: 머니마켓","연동 지수 변동성: 매우 낮음","발행 네트워크: Stellar"]},
];
const BRIEFING={term:{word:"유동성 (Liquidity)",def:"자산을 가격 손실 없이 빠르게 현금으로 바꿀 수 있는 정도. 유동성이 낮으면 팔고 싶을 때 제값을 못 받을 수 있습니다."}};

const SEASONS=[
  {id:"s1",label:"시즌 1",theme:"암호화폐 기초",color:"#8B6CFF",icon:"₿",released:"2026 Q1",
    series:[
      {id:"s1a",title:"비트코인 & 블록체인 완전정복",emoji:"₿",level:"입문",lessons:[
        {t:"블록체인이란?",body:`블록체인은 데이터를 '블록'이라는 단위로 묶어 체인처럼 연결한 분산 장부입니다.\n\n**핵심 특성:**\n• 탈중앙화 — 특정 서버 없이 수천 개의 노드가 기록 보관\n• 불변성 — 한번 기록된 데이터는 사실상 수정 불가\n• 투명성 — 누구나 거래 내역 조회 가능\n\n**블록의 구조:**\n이전 블록의 해시값 + 거래 데이터 + 타임스탬프 + 논스(Nonce)\n\n이전 블록의 해시가 다음 블록에 포함되기 때문에, 하나를 수정하면 이후 모든 블록을 다시 계산해야 합니다.`},
        {t:"비트코인 탄생 배경",body:`2008년 금융위기 직후, '사토시 나카모토'라는 익명의 인물이 논문을 발표합니다.\n\n**논문 제목:** "Bitcoin: A Peer-to-Peer Electronic Cash System"\n\n**핵심 문제 의식:** 은행이라는 중간자 없이 두 사람이 직접 가치를 전송할 수 있을까?\n\n2009년 1월 3일, 최초의 비트코인 블록(제네시스 블록)이 생성됩니다.`},
        {t:"채굴(Mining)과 작업증명",body:`**채굴(Mining)이란?**\n새로운 블록을 검증하고 블록체인에 추가하는 과정입니다.\n\n**작업증명(PoW):**\n복잡한 수학 문제를 가장 먼저 푼 컴퓨터가 새 블록을 만들고 보상을 받습니다.\n\n**반감기(Halving):**\n매 약 4년마다 채굴 보상이 절반으로 줄어듭니다.\n• 2009: 50 BTC\n• 2024: 3.125 BTC\n\n총 발행량 2,100만 개로 고정되어 희소성이 설계에 내장됩니다.`},
        {t:"비트코인 지갑과 주소",body:`**지갑(Wallet)의 오해:**\n비트코인은 지갑 '안에' 있지 않습니다. 블록체인 위 잔액을 조회하고 서명할 수 있는 열쇠(키)를 보관하는 것이 지갑입니다.\n\n**개인키 vs 공개키:**\n• 개인키: 절대 공유 금지. 잃으면 자산 영구 접근 불가\n• 공개키: 개인키에서 수학적으로 파생\n• 주소: 공개키를 해시한 것. 계좌번호처럼 공유 가능\n\n**핵심 원칙:** "Not your keys, not your coins"`},
        {t:"비트코인의 한계와 확장성",body:`**기술적 한계:**\n• 초당 약 7건 처리 (Visa: 수천 건/초)\n• 블록 생성 간격 약 10분\n\n**해결책:**\n• 라이트닝 네트워크 — 오프체인 채널로 빠른 거래\n• SegWit — 블록 용량 효율화\n• Taproot — 프라이버시·스마트 컨트랙트 개선\n\n**결론:** 비트코인은 '디지털 금'(가치 저장)에 최적화, 빠른 결제는 레이어2로 보완합니다.`},
      ]},
      {id:"s1b",title:"이더리움 & 스마트 컨트랙트",emoji:"◆",level:"초급",lessons:[
        {t:"이더리움이란?",body:`이더리움은 2015년 비탈릭 부테린이 만든 블록체인 플랫폼입니다.\n\n**비트코인과의 핵심 차이:**\n비트코인이 '돈 전송' 특화라면, 이더리움은 블록체인 위에서 프로그램(스마트 컨트랙트)을 실행할 수 있는 '탈중앙화 컴퓨터'입니다.\n\n**이더(ETH)의 역할:**\n• 네트워크 수수료(가스) 지불 수단\n• 스테이킹을 통한 네트워크 검증\n• 가치 저장 수단`},
        {t:"스마트 컨트랙트 원리",body:`**스마트 컨트랙트 = 조건부 자동 실행 계약**\n\n"만약 A가 1 ETH를 보내면, 자동으로 토큰 100개를 A에게 전송한다."\n\n이 코드는 블록체인에 올라간 순간부터 누구도 막을 수 없습니다.\n\n**자판기 비유:** 돈을 넣고 버튼을 누르면 자동으로 음료가 나옵니다. 판매원(중간자) 없이.\n\n**활용 분야:**\n• DeFi — 은행 없는 대출·거래\n• NFT — 디지털 소유권 증명\n• RWA — 실물 자산 토큰화`},
        {t:"지분증명(PoS)으로의 전환",body:`**이더리움 머지(The Merge, 2022년 9월)**\n\n작업증명(PoW)에서 지분증명(PoS)으로 전환. 에너지 소비 99.95% 감소.\n\n**지분증명 원리:**\nETH를 '스테이킹(잠금)'해 검증자가 됩니다.\n• 최소 32 ETH 잠금\n• 무작위로 선택된 검증자가 블록 제안\n• 악의적이면 ETH 삭감(슬래싱)`},
        {t:"가스(Gas)와 수수료 구조",body:`**가스(Gas)란?**\n이더리움 네트워크에서 연산 작업에 드는 비용 단위입니다.\n\n**수수료 = 가스 사용량 × (기본 수수료 + 팁)**\n\n**ETH 소각의 의미:**\n기본 수수료가 소각되면서 ETH 공급량이 줄어듭니다. 네트워크가 활발할수록 ETH가 희소해지는 구조.`},
      ]},
    ]},
  {id:"s2",label:"시즌 2",theme:"스테이블코인 & DeFi",color:"#3DDC97",icon:"💵",released:"2026 Q2",
    series:[
      {id:"s2a",title:"스테이블코인 완전 해부",emoji:"⚖️",level:"초급",lessons:[
        {t:"스테이블코인이란?",body:`가격 변동성을 최소화하도록 설계된 암호화폐입니다. 주로 1달러에 고정(페그)됩니다.\n\n**왜 필요한가?**\n비트코인·이더리움의 높은 변동성은 일상 결제나 저축에 불편합니다.\n\n**주요 사용처:**\n• 거래소 기준 통화\n• 국제 송금 (저렴·빠름)\n• DeFi 예치·대출\n• 신흥국 인플레이션 회피`},
        {t:"법정화폐 담보형 (USDT, USDC)",body:`**구조:** 발행사가 실제 달러를 보유하고, 같은 수량의 토큰 발행\n\n**USDT (테더):** 최초·최대 스테이블코인, 준비금 투명성 논란\n**USDC (서클):** 미국 규제 준수에 적극적, 준비금 100% 현금·단기 국채\n\n**핵심 리스크:**\n• 발행사 파산/규제 위험 (중앙화)\n• 정부의 동결·차단 가능`},
        {t:"암호화폐 담보형 (DAI)",body:`**구조:** ETH 등을 담보로 맡기고 스테이블코인 발행\n\n**DAI (MakerDAO):**\n• 담보 비율 최소 150% 유지 (초과담보)\n• 담보 가치 하락 시 자동 청산\n\n**왜 초과담보?** 1 DAI 발행에 1.5 ETH 가치를 잠급니다. ETH가 급락해도 DAI 가치를 지키기 위함입니다.`},
        {t:"알고리즘형과 UST 붕괴",body:`**알고리즘형:** 담보 없이 알고리즘과 인센티브로 페그 유지\n\n**Terra/LUNA-UST 붕괴 (2022년 5월):**\n1. 대규모 UST 매도 공세\n2. LUNA 대량 발행으로 가격 폭락\n3. 뱅크런 → 2주 만에 LUNA 99.99% 하락\n4. 약 400억 달러 가치 소멸\n\n**교훈:** "죽음의 나선(Death Spiral)" 리스크.`},
        {t:"스테이블코인과 규제",body:`**각국의 규제 움직임:**\n\n🇺🇸 미국: 2025년 GENIUS Act — 준비금 100% 요구\n🇪🇺 EU: MiCA 시행 — EMT로 분류\n🇰🇷 한국: 가상자산이용자보호법 시행 (2024)\n\n**Pi Network와 스테이블코인:**\nPi 생태계 내 결제 안정성을 위해 연동 논의 진행 중.`},
      ]},
      {id:"s2b",title:"DeFi: 탈중앙화 금융",emoji:"🏦",level:"중급",lessons:[
        {t:"DeFi란 무엇인가?",body:`**DeFi(Decentralized Finance):**\n은행·증권사 없이 블록체인 스마트 컨트랙트로 구현된 금융 서비스입니다.\n\n**전통 금융 vs DeFi:**\n• 운영 주체: 기업·은행 vs 스마트 컨트랙트\n• 이용 시간: 영업시간 vs 24/7\n• 계좌 개설: 신분증 필요 vs 지갑 주소만\n\n**주요 프로토콜:** Uniswap, Aave, MakerDAO, Lido`},
        {t:"AMM과 유동성 풀",body:`**자동화 시장조성자(AMM):**\n주문서 없이 수학 공식으로 가격을 결정합니다.\n\n**핵심 공식:** x × y = k\n토큰A를 사면 x 감소 → y 증가 → 토큰B 가격 상승\n\n**비영구적 손실:** 두 토큰 가격 비율이 크게 변하면 단순 보유보다 낮은 가치가 될 수 있습니다.`},
        {t:"대출 프로토콜 (Aave)",body:`**DeFi 대출의 원리:**\n1. 공급자: 토큰 예치 → 이자 수취\n2. 대출자: 담보 예치 → 초과담보 조건으로 대출\n3. 청산자: 담보비율 미달 계정 청산\n\n**플래시 론:** 담보 없이 대출받되, 같은 트랜잭션 안에서 갚아야 합니다. DeFi에만 존재하는 혁신.`},
      ]},
    ]},
  {id:"s3",label:"시즌 3",theme:"Pi코인 & RWA",color:"#E6B95C",icon:"π",released:"2026 Q3",
    series:[
      {id:"s3a",title:"파이코인 완전 분석",emoji:"π",level:"초급",lessons:[
        {t:"파이코인이란?",body:`파이코인(Pi Network)은 스탠퍼드 박사 출신 Nicolas Kokkalis가 2019년 창설한 암호화폐 프로젝트입니다.\n\n**핵심 비전:** "모바일 채굴로 일반인도 참여할 수 있는 암호화폐 생태계"\n\n**주요 타임라인:**\n• 2019: 앱 출시\n• 2023: 오픈 메인넷 개막\n• 2025~: 생태계 앱 확장`},
        {t:"파이 채굴 메커니즘",body:`**Pi의 합의 메커니즘: SCP(Stellar Consensus Protocol)**\n\nPoW나 PoS와 달리 페더레이티드 비잔틴 합의를 사용합니다.\n\n**채굴 속도 결정 요소:**\n1. 기본 채굴량\n2. 보안 서클 보너스\n3. 앰배서더 보너스\n4. 노드 운영 보상\n\n**주의:** 채굴된 Pi는 KYC 완료 후 실제 사용 가능합니다.`},
        {t:"파이 생태계와 실제 사용처",body:`**Pi 브라우저와 앱 생태계:**\nPi Browser를 통해 Pi로 결제할 수 있는 dApps 이용 가능.\n\n**Pi로 가능한 것들:**\n• Pi Marketplace: P2P 거래\n• 도메인 이름 등록\n• 제휴 상인 결제\n\n**Pi의 가치는 결국 생태계 사용처에 달려 있습니다.**`},
        {t:"파이코인 리스크 분석",body:`**긍정 요소:**\n✅ 수천만 명의 사용자 기반\n✅ KYC로 실제 신원 연결\n✅ Stellar 기반 빠른 트랜잭션\n\n**리스크 요소:**\n⚠️ 핵심 팀의 중앙 통제\n⚠️ 공개 감사 부재\n⚠️ 주요 거래소 미상장\n\n⚠️ 투자 권유 아님`},
        {t:"Pi와 Stellar 네트워크",body:`**왜 Stellar인가?**\nPi Network는 Stellar(XLM)의 합의 프로토콜(SCP)을 기반으로 구축되었습니다.\n\n**Stellar의 특징:**\n• 초당 수천 건 처리\n• 수수료 극히 낮음\n• 국제 송금 특화\n\n**Pi + Stellar 시너지:** 수천만 사용자가 Stellar 기반 RWA 토큰에 접근할 인프라가 갖춰져 있습니다.`},
      ]},
      {id:"s3b",title:"RWA: 실물자산의 토큰화",emoji:"🏛️",level:"중급",lessons:[
        {t:"RWA란 무엇인가?",body:`**Real World Asset (RWA):**\n국채, 주식, 부동산, 금 등 실물 자산을 블록체인 토큰으로 표현한 것입니다.\n\n**시장 규모:**\n• 2023년: 약 50억 달러\n• 2025년: 200억 달러 이상\n• BCG 2030년 예측: 16조 달러`},
        {t:"RWA 토큰화 작동 원리",body:`**토큰화 3단계:**\n\n**1단계: 오프체인** 실물 자산을 SPV/수탁사에 이전, 법적 권리 명시\n**2단계: 온체인** 스마트 컨트랙트로 토큰 발행, KYC/AML 연결\n**3단계: 오라클** Chainlink 등이 가격을 블록체인에 전달\n\n**핵심:** 온체인과 오프체인의 연결이 신뢰의 핵심입니다.`},
        {t:"RWA의 기회와 리스크",body:`**기회:**\n✅ 분할 소유 — 고가 자산 소액 투자\n✅ 24/7 거래\n✅ 자동화 — 이자·배당 자동 지급\n\n**리스크:**\n⚠️ 법적 위험 — 토큰이 실제 소유권을 보장하는가?\n⚠️ 발행사 위험\n⚠️ 규제 위험\n⚠️ 유동성 위험`},
      ]},
    ]},
  {id:"s4",label:"시즌 4",theme:"투자 전략 & 리스크",color:"#FF6B81",icon:"🛡️",released:"2026 Q4",
    series:[
      {id:"s4a",title:"암호화폐 투자 심리학",emoji:"🧠",level:"중급",lessons:[
        {t:"FOMO와 FUD",body:`**FOMO:** "나만 뒤처지는 것 같다"는 공포. 충동 매수 유발.\n**FUD:** 근거 없는 부정적 정보로 패닉 매도 유발.\n\n**워런 버핏:** "남들이 탐욕스러울 때 두려워하고, 남들이 두려워할 때 탐욕스러워라."`},
        {t:"포트폴리오 구성 전략",body:`**코어-새틀라이트 전략:**\n• 코어(70~80%): 비트코인, 이더리움\n• 새틀라이트(20~30%): 알트코인, RWA, Pi\n\n**리스크 수준별 배분:**\n🟢 보수형: BTC 50% + 스테이블코인 30% + ETH 20%\n🟡 균형형: BTC 35% + ETH 25% + RWA 20% + 알트 20%\n\n**DCA:** 매주·매월 일정 금액 분할 매수.`},
        {t:"온체인 분석 기초",body:`**온체인 분석이란?**\n블록체인 공개 데이터를 분석해 시장 심리와 자금 흐름을 파악합니다.\n\n**주요 지표:**\n📊 거래소 잔고: BTC 보유량 감소 = 강세\n📊 MVRV 비율: >3 고점 / <1 저점\n\n**무료 도구:** Glassnode, CryptoQuant`},
      ]},
    ]},
];

const FREE_SERIES=["s1a"];
const FREE_LESSON_LIMIT=2;
const PRICE_USD=4.99;
const PRICE_PI=34.6;
function isLessonLocked(seriesId,lessonIdx,premium){
  if(premium)return false;
  if(FREE_SERIES.includes(seriesId))return false;
  return lessonIdx>=FREE_LESSON_LIMIT;
}
const REVENUE={mrr:18420,subscribers:3691,freeUsers:47210,affiliate:4870,ads:1320,churn:3.4,payMethodSplit:{fiat:64,pi:36},monthly:[9200,11500,13100,14800,16200,18420],months:["1월","2월","3월","4월","5월","6월"]};

function series(seed,n=28,vol=0.02){
  const out=[];let v=seed,r=seed*9301;
  for(let i=0;i<n;i++){r=(r*9301+49297)%233280;v=v*(1+(r/233280-0.5)*vol);out.push(v);}
  return out;
}
const fmtUsd=n=>n>=1000?n.toLocaleString("en-US",{maximumFractionDigits:2}):n.toFixed(4);
const fmtPi=n=>n.toFixed(4);

function Tag({children,color,bg}){
  return <span style={{...B,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:999,background:bg||"rgba(139,108,255,0.15)",color:color||C.purple}}>{children}</span>;
}
function PBar({pct,color}){
  return <div style={{height:4,background:C.card2,borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:color||C.purple,borderRadius:4,transition:"width .5s ease"}}/></div>;
}
function Disclaimer({small}){
  return <div style={{...B,fontSize:small?10:11,color:C.faint,lineHeight:1.5,textAlign:"center",padding:"0 4px"}}>ⓘ 정보 제공 목적이며 투자 권유가 아닙니다. 본 앱은 자산을 보관하거나 매매를 대행하지 않습니다.</div>;
}
function Spark({data,color,w=60,h=24}){
  const min=Math.min(...data),max=Math.max(...data),range=max-min||1;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/range)*h}`).join(" ");
  return <svg width={w} height={h} style={{overflow:"visible"}}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function BigChart({data,color}){
  const w=320,h=130,p=6;
  const min=Math.min(...data),max=Math.max(...data),range=max-min||1;
  const xy=data.map((v,i)=>[p+(i/(data.length-1))*(w-p*2),p+(h-p*2)-((v-min)/range)*(h-p*2)]);
  const line=xy.map(pt=>pt.join(",")).join(" ");
  const area=`${p},${h-p} ${line} ${w-p},${h-p}`;
  return <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{display:"block"}}>
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.28"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
    <polygon points={area} fill="url(#g)"/>
    <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>;
}
function LBody({text}){
  return <div style={{...B,fontSize:13,color:C.muted,lineHeight:1.75,whiteSpace:"pre-wrap"}}>
    {text.split('\n').map((line,i)=>{
      if(line.startsWith('**')&&line.endsWith('**'))return <div key={i} style={{color:C.text,fontWeight:700,marginTop:10,marginBottom:2}}>{line.replace(/\*\*/g,'')}</div>;
      if(line.startsWith('• '))return <div key={i} style={{paddingLeft:12,marginTop:2}}>• {line.slice(2)}</div>;
      if(/^[✅⚠️□🟢🟡🔴📊🇺🇸🇪🇺🇰🇷]/.test(line))return <div key={i} style={{marginTop:4}}>{line}</div>;
      return line?<div key={i} style={{marginTop:4}}>{line}</div>:<div key={i} style={{marginTop:6}}/>;
    })}
  </div>;
}

async function piTestPayment(setStatus){
  if(typeof window==="undefined"||!window.Pi){
    setStatus("⚠️ Pi Browser에서 열어야 합니다.");
    return;
  }
  try{
    setStatus("Pi 로그인 중...");
    await window.Pi.authenticate(["payments"], ()=>{});
    setStatus("결제 생성 중...");
    window.Pi.createPayment(
      { amount:0.001, memo:"RWA Academy 테스트 결제", metadata:{ test:true } },
      {
        onReadyForServerApproval:(paymentId)=>{
          setStatus("서버 승인 중...");
          fetch("/api/approve",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({paymentId})});
        },
        onReadyForServerCompletion:(paymentId,txid)=>{
          setStatus("결제 완료 처리 중...");
          fetch("/api/complete",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({paymentId,txid})})
            .then(()=>setStatus("✅ 테스트 결제 완료! Pi 포털에서 체크리스트를 확인하세요."));
        },
        onCancel:()=>setStatus("결제가 취소되었습니다."),
        onError:(err)=>setStatus("오류: "+String(err)),
      }
    );
  }catch(e){
    setStatus("오류: "+String(e));
  }
}

function PiTestButton(){
  const [status,setStatus]=useState("");
  return <div style={{margin:"0 16px 12px",background:`linear-gradient(135deg,${C.purpleDeep},${C.purple})`,borderRadius:16,padding:16}}>
    <div style={{...D,fontSize:14,fontWeight:800,color:"#fff"}}>π Pi 테스트 결제 (심사용)</div>
    <div style={{...B,fontSize:11.5,color:"rgba(255,255,255,0.85)",marginTop:4,lineHeight:1.5}}>체크리스트 통과를 위한 0.001 테스트 Pi 결제입니다. Pi Browser에서 실행하세요.</div>
    <button onClick={()=>piTestPayment(setStatus)} style={{width:"100%",marginTop:12,border:"none",cursor:"pointer",background:"#fff",color:C.purpleDeep,borderRadius:12,padding:12,...B,fontSize:14,fontWeight:800}}>테스트 결제 (0.001 Pi)</button>
    {status&&<div style={{...B,fontSize:12,color:"#fff",marginTop:10,background:"rgba(0,0,0,0.2)",borderRadius:8,padding:"8px 10px",lineHeight:1.5}}>{status}</div>}
  </div>;
}

function Home({go,setTab}){
  const featuredSeason=SEASONS[0];
  const featuredSeries=featuredSeason.series[0];
  return <div className="sc" style={{overflowY:"auto",height:"100%",animation:"rise .4s ease both"}}>
    <div style={{padding:"8px 18px 4px"}}>
      <div style={{...B,fontSize:12,color:C.muted}}>안녕하세요 👋</div>
      <div style={{...D,fontSize:22,fontWeight:800,color:C.text,letterSpacing:-0.5}}>오늘도 한 걸음 배워볼까요</div>
    </div>
    <button onClick={()=>setTab("learn")} style={{display:"block",width:"100%",textAlign:"left",border:"none",cursor:"pointer",margin:"12px 0",padding:"0 16px"}}>
      <div style={{borderRadius:20,padding:18,background:`linear-gradient(135deg,${C.purpleDeep},${C.purple})`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-30,top:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.12)"}}/>
        <div style={{...M,fontSize:10,color:"rgba(255,255,255,0.8)"}}>📚 오늘의 학습 · {featuredSeason.theme}</div>
        <div style={{...D,fontSize:19,fontWeight:800,color:"#fff",marginTop:6}}>{featuredSeries.emoji} {featuredSeries.title}</div>
        <div style={{...B,fontSize:12.5,color:"rgba(255,255,255,0.9)",marginTop:6,lineHeight:1.5}}>{featuredSeries.lessons.length}개 강의 · {featuredSeries.level} · 지금 무료로 시작하기</div>
        <div style={{marginTop:12,display:"inline-block",background:"rgba(255,255,255,0.2)",borderRadius:10,padding:"8px 14px",...B,fontSize:13,fontWeight:700,color:"#fff"}}>학습 시작 →</div>
      </div>
    </button>
    <div style={{margin:"4px 16px 12px",background:C.card,borderRadius:16,padding:14}}>
      <div style={{...B,fontSize:11,color:C.gold,fontWeight:600}}>💡 오늘의 용어 · {BRIEFING.term.word}</div>
      <div style={{...B,fontSize:12.5,color:C.muted,marginTop:5,lineHeight:1.55}}>{BRIEFING.term.def}</div>
    </div>
    <div style={{padding:"0 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{...D,fontSize:15,fontWeight:700,color:C.text}}>학습 시즌</div>
        <button onClick={()=>setTab("learn")} style={{border:"none",background:"transparent",color:C.purple,cursor:"pointer",...B,fontSize:12,fontWeight:600}}>전체 보기 ›</button>
      </div>
      {SEASONS.map(sn=>{
        const totalL=sn.series.reduce((a,sr)=>a+sr.lessons.length,0);
        return <button key={sn.id} onClick={()=>setTab("learn")} style={{width:"100%",textAlign:"left",border:"none",cursor:"pointer",background:C.card,borderRadius:14,padding:13,marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontSize:20,width:40,height:40,background:`${sn.color}22`,borderRadius:12,display:"grid",placeItems:"center",color:sn.color,...D,fontWeight:800,flexShrink:0}}>{sn.icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{...B,fontSize:13,fontWeight:600,color:C.text}}>{sn.label}: {sn.theme}</div>
            <div style={{...B,fontSize:11,color:C.muted}}>{totalL}강 · {sn.series.length}시리즈</div>
          </div>
          <span style={{color:C.muted}}>›</span>
        </button>;
      })}
    </div>
    <div style={{padding:"12px 16px 4px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{...D,fontSize:14,fontWeight:700,color:C.muted}}>참고: 학습용 자산 시세</div>
        <button onClick={()=>setTab("market")} style={{border:"none",background:"transparent",color:C.faint,cursor:"pointer",...B,fontSize:11}}>더보기 ›</button>
      </div>
      <div style={{display:"flex",gap:8,overflowX:"auto"}} className="sc">
        {ASSETS.map(a=>{
          const up=a.chg>=0;
          return <button key={a.id} onClick={()=>go("detail",a.id)} style={{flexShrink:0,minWidth:120,border:"none",cursor:"pointer",background:C.card,borderRadius:12,padding:12,textAlign:"left"}}>
            <div style={{fontSize:18}}>{a.icon}</div>
            <div style={{...B,fontSize:11,color:C.muted,marginTop:4}}>{a.sym}</div>
            <div style={{...M,fontSize:13,color:C.text}}>${fmtUsd(a.price)}</div>
            <div style={{...M,fontSize:10,color:up?C.up:C.down}}>{up?"▲":"▼"} {Math.abs(a.chg).toFixed(2)}%</div>
          </button>;
        })}
      </div>
    </div>
    <div style={{height:14}}/><Disclaimer/><div style={{height:20}}/>
  </div>;
}

function Market({go}){
  const [q,setQ]=useState("");
  const [filter,setFilter]=useState("전체");
  const cats=["전체","국채","주식","귀금속","현금성"];
  const list=ASSETS.filter(a=>(filter==="전체"||a.cls===filter)&&(a.name.includes(q)||a.sym.toLowerCase().includes(q.toLowerCase())));
  return <div className="sc" style={{overflowY:"auto",height:"100%",animation:"rise .4s ease both"}}>
    <div style={{padding:"8px 18px 0"}}>
      <div style={{...D,fontSize:22,fontWeight:800,color:C.text}}>마켓</div>
      <div style={{...B,fontSize:12,color:C.muted,marginTop:2}}>학습용 토큰화 자산 시세 (조회 전용)</div>
    </div>
    <div style={{padding:"12px 16px 0"}}>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 자산 검색" style={{...B,width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"11px 14px",color:C.text,fontSize:14,outline:"none"}}/>
    </div>
    <div className="sc" style={{display:"flex",gap:8,padding:"12px 16px",overflowX:"auto"}}>
      {cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{...B,whiteSpace:"nowrap",border:"none",cursor:"pointer",fontSize:12,fontWeight:600,padding:"7px 14px",borderRadius:999,background:filter===c?C.purple:C.card,color:filter===c?"#fff":C.muted}}>{c}</button>)}
    </div>
    <div style={{padding:"0 16px"}}>
      {list.map(a=>{
        const up=a.chg>=0;
        return <button key={a.id} onClick={()=>go("detail",a.id)} style={{width:"100%",textAlign:"left",border:"none",cursor:"pointer",background:C.card,borderRadius:16,padding:14,marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontSize:22,width:40,height:40,borderRadius:12,background:C.card2,display:"grid",placeItems:"center"}}>{a.icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{...B,fontSize:14,fontWeight:600,color:C.text}}>{a.name}</div>
            <Tag bg={C.card2} color={C.muted}>{a.cls}</Tag>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{...M,fontSize:13,color:C.text}}>${fmtUsd(a.price)}</div>
            <div style={{...M,fontSize:11,color:up?C.up:C.down}}>{up?"▲":"▼"} {Math.abs(a.chg).toFixed(2)}%</div>
          </div>
        </button>;
      })}
      {list.length===0&&<div style={{...B,color:C.muted,textAlign:"center",padding:30,fontSize:13}}>검색 결과가 없습니다.</div>}
    </div>
    <div style={{height:14}}/><Disclaimer/><div style={{height:20}}/>
  </div>;
}

function Detail({id,back}){
  const a=ASSETS.find(x=>x.id===id);
  const up=a.chg>=0;
  const data=useMemo(()=>series(a.price*100,40,a.vol),[id]);
  return <div className="sc" style={{overflowY:"auto",height:"100%",animation:"rise .35s ease both"}}>
    <div style={{padding:"6px 16px",display:"flex",alignItems:"center",gap:10}}>
      <button onClick={back} style={{border:"none",background:C.card,color:C.text,width:36,height:36,borderRadius:12,cursor:"pointer",fontSize:16}}>←</button>
      <div style={{fontSize:24}}>{a.icon}</div>
      <div>
        <div style={{...B,fontSize:15,fontWeight:700,color:C.text}}>{a.name}</div>
        <div style={{...M,fontSize:11,color:C.muted}}>{a.sym} · {a.cls}</div>
      </div>
    </div>
    <div style={{padding:"8px 18px"}}>
      <div style={{...M,fontSize:28,fontWeight:700,color:C.text}}>${fmtUsd(a.price)}</div>
      <div style={{...M,fontSize:13,color:up?C.up:C.down}}>{up?"▲":"▼"} {Math.abs(a.chg).toFixed(2)}% · ≈ {fmtPi(a.price/PI_USD)} Pi</div>
    </div>
    <div style={{padding:"8px 12px"}}>
      <div style={{background:C.card,borderRadius:16,padding:"10px 8px"}}><BigChart data={data} color={up?C.up:C.down}/></div>
    </div>
    <div style={{padding:"8px 16px"}}>
      <div style={{...B,fontSize:13,color:C.muted,lineHeight:1.6,background:C.card,borderRadius:14,padding:14}}>{a.blurb}</div>
      <div style={{marginTop:10,background:C.card,borderRadius:14,padding:14}}>
        {a.facts.map((f,i)=><div key={i} style={{...B,fontSize:13,color:C.text,padding:"7px 0",borderBottom:i<a.facts.length-1?`1px solid ${C.border}`:"none"}}>• {f}</div>)}
      </div>
    </div>
    <div style={{padding:"8px 16px"}}>
      <div style={{background:C.card2,borderRadius:14,padding:14}}>
        <div style={{...B,fontSize:12,fontWeight:700,color:C.text,marginBottom:6}}>📖 이 자산은 어디서 거래되나요?</div>
        <div style={{...B,fontSize:12,color:C.muted,lineHeight:1.6}}>이런 유형의 토큰화 자산은 일반적으로 인가받은 거래소나 탈중앙화 거래소(DEX)에서 거래됩니다. 본 앱은 교육·정보 제공만 하며, 매매를 중개하거나 대행하지 않습니다.</div>
      </div>
      <div style={{...B,fontSize:10.5,color:C.faint,marginTop:8,textAlign:"center",lineHeight:1.5}}>투자 결정 전 반드시 본인이 직접 조사하시기 바랍니다. (DYOR)</div>
    </div>
    <div style={{height:20}}/>
  </div>;
}

function LessonView({lesson,idx,total,onPrev,onNext,onBack,color}){
  return <div style={{animation:"rise .3s ease both",height:"100%",display:"flex",flexDirection:"column"}}>
    <div style={{padding:"10px 16px",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
      <button onClick={onBack} style={{border:"none",background:C.card,color:C.text,width:34,height:34,borderRadius:10,cursor:"pointer",fontSize:15}}>←</button>
      <div style={{flex:1}}><PBar pct={((idx+1)/total)*100} color={color}/></div>
      <span style={{...M,fontSize:11,color:C.muted}}>{idx+1}/{total}</span>
    </div>
    <div className="sc" style={{flex:1,overflowY:"auto",padding:"4px 18px 16px"}}>
      <div style={{...D,fontSize:19,fontWeight:800,color:C.text,lineHeight:1.3,marginBottom:14}}>{lesson.t}</div>
      <LBody text={lesson.body}/>
      <div style={{height:16}}/>
    </div>
    <div style={{padding:"10px 16px",display:"flex",gap:10,flexShrink:0}}>
      <button onClick={onPrev} disabled={idx===0} style={{flex:1,border:`1px solid ${C.border}`,background:"transparent",color:idx===0?C.faint:C.text,borderRadius:12,padding:11,cursor:idx===0?"default":"pointer",...B,fontSize:14}}>← 이전</button>
      <button onClick={onNext} style={{flex:2,border:"none",background:color,color:"#0A0912",borderRadius:12,padding:11,cursor:"pointer",...B,fontSize:14,fontWeight:700}}>{idx===total-1?"완료 ✓":"다음 →"}</button>
    </div>
  </div>;
}

function SeriesView({series,seriesId,onBack,onSelectLesson,completed,color,premium}){
  return <div className="sc" style={{overflowY:"auto",height:"100%",animation:"rise .3s ease both"}}>
    <div style={{padding:"10px 16px 0",display:"flex",alignItems:"center",gap:10}}>
      <button onClick={onBack} style={{border:"none",background:C.card,color:C.text,width:34,height:34,borderRadius:10,cursor:"pointer",fontSize:15}}>←</button>
      <div>
        <div style={{...D,fontSize:16,fontWeight:800,color:C.text}}>{series.emoji} {series.title}</div>
        <Tag color={color} bg={`${color}22`}>{series.level}</Tag>
      </div>
    </div>
    <div style={{padding:"12px 16px"}}>
      <PBar pct={(completed/series.lessons.length)*100} color={color}/>
      <div style={{...B,fontSize:11,color:C.muted,marginTop:4}}>{completed}/{series.lessons.length} 레슨 완료</div>
      <div style={{marginTop:12}}>
        {series.lessons.map((l,i)=>{
          const locked=isLessonLocked(seriesId,i,premium);
          const done=i<completed,active=i===completed&&!locked;
          return <button key={i} onClick={()=>onSelectLesson(i,locked)} style={{width:"100%",textAlign:"left",border:"none",cursor:"pointer",background:active?`${color}18`:C.card,borderRadius:14,padding:14,marginBottom:8,display:"flex",alignItems:"center",gap:12,borderLeft:active?`3px solid ${color}`:"3px solid transparent",opacity:locked?0.6:1}}>
            <div style={{width:28,height:28,borderRadius:8,background:done?color:active?`${color}33`:C.card2,display:"grid",placeItems:"center",fontSize:13,color:done?"#0A0912":active?color:C.faint,fontWeight:700,flexShrink:0,...M}}>
              {locked?"🔒":done?"✓":i+1}
            </div>
            <div style={{flex:1}}>
              <div style={{...B,fontSize:13,fontWeight:600,color:done?C.muted:C.text}}>{l.t}</div>
              {locked&&<div style={{...B,fontSize:10,color:C.gold,marginTop:2}}>프리미엄 전용</div>}
            </div>
            {locked?<span style={{color:C.gold,fontSize:12}}>👑</span>:active&&<span style={{color,fontSize:13}}>▶</span>}
          </button>;
        })}
      </div>
    </div>
  </div>;
}

function SeasonView({season,onBack,onSelectSeries,progress}){
  const totalL=season.series.reduce((s,sr)=>s+sr.lessons.length,0);
  const doneL=season.series.reduce((s,sr)=>s+(progress[sr.id]||0),0);
  return <div className="sc" style={{overflowY:"auto",height:"100%",animation:"rise .3s ease both"}}>
    <div style={{padding:"10px 16px",display:"flex",alignItems:"center",gap:10}}>
      <button onClick={onBack} style={{border:"none",background:C.card,color:C.text,width:34,height:34,borderRadius:10,cursor:"pointer",fontSize:15}}>←</button>
      <div style={{fontSize:22}}>{season.icon}</div>
      <div>
        <div style={{...D,fontSize:16,fontWeight:800,color:C.text}}>{season.label}: {season.theme}</div>
        <div style={{...B,fontSize:11,color:C.muted}}>{doneL}/{totalL} 레슨 완료</div>
      </div>
    </div>
    <div style={{padding:"0 16px 16px"}}>
      <PBar pct={totalL>0?(doneL/totalL)*100:0} color={season.color}/>
      <div style={{marginTop:14}}>
        {season.series.map(sr=>{
          const done=progress[sr.id]||0,pct=Math.round((done/sr.lessons.length)*100);
          return <button key={sr.id} onClick={()=>onSelectSeries(sr.id)} style={{width:"100%",textAlign:"left",border:"none",cursor:"pointer",background:C.card,borderRadius:16,padding:16,marginBottom:10,display:"flex",gap:14,alignItems:"center"}}>
            <div style={{fontSize:26,width:48,height:48,background:C.card2,borderRadius:14,display:"grid",placeItems:"center",flexShrink:0}}>{sr.emoji}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{...D,fontSize:14,fontWeight:700,color:C.text,lineHeight:1.2}}>{sr.title}</div>
              <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
                <Tag color={season.color} bg={`${season.color}22`}>{sr.level}</Tag>
                <Tag color={C.muted} bg={C.card2}>{sr.lessons.length}강</Tag>
              </div>
              <div style={{marginTop:8}}>
                <PBar pct={pct} color={season.color}/>
                <div style={{...M,fontSize:10,color:C.faint,marginTop:3}}>{pct}% 완료</div>
              </div>
            </div>
            <span style={{color:C.muted}}>›</span>
          </button>;
        })}
      </div>
    </div>
  </div>;
}

function LearnHome({onSelectSeason,progress,currentSeason,premium,onUpgrade}){
  const totalAll=SEASONS.reduce((s,sn)=>s+sn.series.reduce((a,sr)=>a+sr.lessons.length,0),0);
  const doneAll=SEASONS.reduce((s,sn)=>s+sn.series.reduce((a,sr)=>a+(progress[sr.id]||0),0),0);
  return <div className="sc" style={{overflowY:"auto",height:"100%",animation:"rise .35s ease both"}}>
    <div style={{padding:"8px 18px 4px"}}>
      <div style={{...D,fontSize:22,fontWeight:800,color:C.text}}>배우기</div>
      <div style={{...B,fontSize:12,color:C.muted}}>시즌별 금융·블록체인 완전 정복</div>
    </div>
    {premium?
      <div style={{margin:"10px 16px",borderRadius:14,padding:"12px 16px",background:"rgba(61,220,151,0.1)",border:`1px solid rgba(61,220,151,0.3)`,...B,fontSize:13,color:C.up,fontWeight:600,display:"flex",alignItems:"center",gap:8}}>👑 프리미엄 이용 중 — 모든 콘텐츠가 열렸습니다.</div>
      :<button onClick={onUpgrade} style={{width:"100%",textAlign:"left",border:"none",cursor:"pointer",margin:"10px 0",padding:"0 16px"}}>
        <div style={{borderRadius:16,padding:16,background:`linear-gradient(135deg,${C.goldDeep},${C.gold})`,display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontSize:26}}>👑</div>
          <div style={{flex:1}}>
            <div style={{...D,fontSize:15,fontWeight:800,color:"#1A1505"}}>프리미엄으로 전체 잠금 해제</div>
            <div style={{...B,fontSize:11.5,color:"rgba(26,21,5,0.75)",marginTop:2}}>30강+ 심화 콘텐츠 · 신규 시즌 자동 포함 · 광고 제거</div>
          </div>
          <div style={{...M,fontSize:13,fontWeight:700,color:"#1A1505",whiteSpace:"nowrap"}}>${PRICE_USD}/월 ›</div>
        </div>
      </button>
    }
    <div style={{margin:"10px 16px",background:`linear-gradient(135deg,${C.purpleDeep}88,${C.purple}55)`,borderRadius:18,padding:16,border:`1px solid ${C.borderStrong}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:8}}>
        <div>
          <div style={{...B,fontSize:11,color:"rgba(255,255,255,0.7)"}}>전체 학습 진행도</div>
          <div style={{...D,fontSize:24,fontWeight:800,color:"#fff"}}>{doneAll} <span style={{fontSize:14,color:"rgba(255,255,255,0.6)"}}>/ {totalAll} 강</span></div>
        </div>
        <div style={{...M,fontSize:20,fontWeight:700,color:C.gold}}>{totalAll>0?Math.round((doneAll/totalAll)*100):0}%</div>
      </div>
      <PBar pct={totalAll>0?(doneAll/totalAll)*100:0} color={C.gold}/>
    </div>
    <div style={{padding:"4px 16px 20px"}}>
      <div style={{...D,fontSize:15,fontWeight:700,color:C.text,marginBottom:10}}>시즌 목록</div>
      {SEASONS.map(sn=>{
        const isCurrent=sn.id===currentSeason;
        const totalL=sn.series.reduce((a,sr)=>a+sr.lessons.length,0);
        const doneL=sn.series.reduce((a,sr)=>a+(progress[sr.id]||0),0);
        const pct=totalL>0?Math.round((doneL/totalL)*100):0;
        const hasFree=sn.series.some(sr=>FREE_SERIES.includes(sr.id));
        return <button key={sn.id} onClick={()=>onSelectSeason(sn.id)} style={{width:"100%",textAlign:"left",border:`2px solid ${isCurrent?sn.color:"transparent"}`,cursor:"pointer",background:C.card,borderRadius:18,padding:16,marginBottom:10,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:10,right:10,display:"flex",gap:5}}>
            {!premium&&!hasFree&&<Tag color={C.gold} bg={`${C.gold}22`}>👑 PRO</Tag>}
            {isCurrent&&<Tag color={sn.color} bg={`${sn.color}22`}>NOW</Tag>}
          </div>
          <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{fontSize:28,width:52,height:52,background:`${sn.color}22`,borderRadius:16,display:"grid",placeItems:"center",flexShrink:0,color:sn.color,...D,fontWeight:800}}>{sn.icon}</div>
            <div style={{flex:1}}>
              <div style={{...D,fontSize:13,fontWeight:800,color:C.text}}>{sn.label}</div>
              <div style={{...B,fontSize:15,fontWeight:700,color:C.text,lineHeight:1.2}}>{sn.theme}</div>
              <div style={{...B,fontSize:11,color:C.faint,marginTop:2}}>총 {totalL}강 · {sn.series.length}시리즈 · {sn.released}</div>
              <div style={{marginTop:8}}>
                <PBar pct={pct} color={sn.color}/>
                <div style={{...M,fontSize:10,color:C.faint,marginTop:3}}>{doneL}/{totalL} · {pct}%</div>
              </div>
            </div>
          </div>
        </button>;
      })}
    </div>
  </div>;
}

function Learn({premium,setPremium}){
  const [screen,setScreen]=useState({type:"home"});
  const [progress,setProgress]=useState({});
  const [seasonIdx,setSeasonIdx]=useState(0);
  const [paywall,setPaywall]=useState(null);
  useEffect(()=>{const t=setInterval(()=>setSeasonIdx(i=>(i+1)%SEASONS.length),90000);return()=>clearInterval(t);},[]);
  const currentSeason=SEASONS[seasonIdx].id;
  const markDone=(seriesId,lessonIdx)=>setProgress(p=>({...p,[seriesId]:Math.max(p[seriesId]||0,lessonIdx+1)}));
  const subscribe=()=>{setPremium(true);setPaywall(null);};

  let bodyEl;
  if(screen.type==="home") bodyEl=<LearnHome onSelectSeason={id=>setScreen({type:"season",seasonId:id})} progress={progress} currentSeason={currentSeason} premium={premium} onUpgrade={()=>setPaywall({context:null})}/>;
  else if(screen.type==="season"){
    const season=SEASONS.find(s=>s.id===screen.seasonId);
    bodyEl=<SeasonView season={season} onBack={()=>setScreen({type:"home"})} onSelectSeries={id=>setScreen({type:"series",seasonId:screen.seasonId,seriesId:id})} progress={progress}/>;
  }
  else if(screen.type==="series"){
    const season=SEASONS.find(s=>s.id===screen.seasonId);
    const sr=season.series.find(s=>s.id===screen.seriesId);
    if(screen.lessonIdx!==undefined){
      bodyEl=<LessonView lesson={sr.lessons[screen.lessonIdx]} idx={screen.lessonIdx} total={sr.lessons.length} color={season.color}
        onBack={()=>setScreen({type:"series",seasonId:screen.seasonId,seriesId:screen.seriesId})}
        onPrev={()=>setScreen(s=>({...s,lessonIdx:Math.max(0,s.lessonIdx-1)}))}
        onNext={()=>{
          markDone(sr.id,screen.lessonIdx);
          const nextIdx=screen.lessonIdx+1;
          if(nextIdx<sr.lessons.length){
            if(isLessonLocked(sr.id,nextIdx,premium)){
              setScreen({type:"series",seasonId:screen.seasonId,seriesId:screen.seriesId});
              setPaywall({context:`'${sr.title}'의 나머지 강의를 보려면 프리미엄이 필요합니다.`});
            } else setScreen(s=>({...s,lessonIdx:nextIdx}));
          } else setScreen({type:"series",seasonId:screen.seasonId,seriesId:screen.seriesId});
        }}/>;
    } else {
      bodyEl=<SeriesView series={sr} seriesId={sr.id} color={season.color} completed={progress[sr.id]||0} premium={premium}
        onBack={()=>setScreen({type:"season",seasonId:screen.seasonId})}
        onSelectLesson={(i,locked)=>{
          if(locked) setPaywall({context:`'${sr.title}'의 이 강의는 프리미엄 전용입니다.`});
          else setScreen({...screen,lessonIdx:i});
        }}/>;
    }
  }
  return <div style={{height:"100%",position:"relative"}}>
    {bodyEl}
    {paywall&&<Paywall context={paywall.context} onClose={()=>setPaywall(null)} onSubscribe={subscribe}/>}
  </div>;
}

function Paywall({onClose,onSubscribe,context}){
  const [method,setMethod]=useState("fiat");
  const [paying,setPaying]=useState(false);
  const pay=()=>{setPaying(true);setTimeout(()=>{onSubscribe(method);},1100);};
  return <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",zIndex:50,display:"flex",alignItems:"flex-end",animation:"rise .25s ease both"}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{width:"100%",background:`linear-gradient(180deg,${C.card2},${C.card})`,borderRadius:"24px 24px 0 0",border:`1px solid ${C.borderStrong}`,borderBottom:"none",padding:"20px 18px 22px",maxHeight:"88%",overflowY:"auto"}} className="sc">
      <div style={{width:38,height:4,background:C.faint,borderRadius:4,margin:"0 auto 16px"}}/>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:34}}>👑</div>
        <div style={{...D,fontSize:21,fontWeight:800,color:C.text,marginTop:6}}>프리미엄</div>
        <div style={{...B,fontSize:12.5,color:C.muted,marginTop:4,lineHeight:1.5}}>{context||"모든 시즌·시리즈 강의를 잠금 해제하세요."}</div>
      </div>
      <div style={{background:C.bg2,borderRadius:14,padding:14,marginTop:16}}>
        {["전체 30강+ 심화 콘텐츠 무제한","신규 시즌 자동 업데이트 포함","심화 시장 분석","광고 완전 제거"].map((f,i)=>
          <div key={i} style={{...B,fontSize:13,color:C.text,padding:"6px 0",display:"flex",gap:8,alignItems:"center"}}><span style={{color:C.up}}>✓</span>{f}</div>
        )}
      </div>
      <div style={{display:"flex",gap:8,marginTop:16}}>
        <button onClick={()=>setMethod("fiat")} style={{flex:1,border:`2px solid ${method==="fiat"?C.gold:C.border}`,background:method==="fiat"?`${C.gold}14`:"transparent",borderRadius:14,padding:"12px 8px",cursor:"pointer",textAlign:"center"}}>
          <div style={{...B,fontSize:12,fontWeight:700,color:C.text}}>💳 법정화폐</div>
          <div style={{...M,fontSize:15,fontWeight:700,color:C.gold,marginTop:4}}>${PRICE_USD}<span style={{fontSize:10,color:C.faint}}>/월</span></div>
        </button>
        <button onClick={()=>setMethod("pi")} style={{flex:1,border:`2px solid ${method==="pi"?C.purple:C.border}`,background:method==="pi"?`${C.purple}14`:"transparent",borderRadius:14,padding:"12px 8px",cursor:"pointer",textAlign:"center"}}>
          <div style={{...B,fontSize:12,fontWeight:700,color:C.text}}>π Pi 결제</div>
          <div style={{...M,fontSize:15,fontWeight:700,color:C.purple,marginTop:4}}>{PRICE_PI} π<span style={{fontSize:10,color:C.faint}}>/월</span></div>
        </button>
      </div>
      <button onClick={pay} disabled={paying} style={{width:"100%",marginTop:16,border:"none",cursor:paying?"default":"pointer",background:method==="fiat"?C.gold:C.purple,color:method==="fiat"?"#1A1505":"#fff",borderRadius:14,padding:14,...B,fontSize:15,fontWeight:800,opacity:paying?0.7:1}}>
        {paying?"결제 처리 중...":method==="fiat"?`$${PRICE_USD}로 구독 시작`:`${PRICE_PI} Pi로 구독 시작`}
      </button>
      <div style={{...B,fontSize:10.5,color:C.faint,marginTop:10,textAlign:"center",lineHeight:1.5}}>실제 Pi 결제는 매출 탭의 테스트 결제 버튼을 사용하세요. (이 구독창은 데모)</div>
      <button onClick={onClose} style={{width:"100%",marginTop:8,border:"none",background:"transparent",color:C.muted,cursor:"pointer",...B,fontSize:13,padding:8}}>나중에</button>
    </div>
  </div>;
}

function Tracker(){
  const [addr,setAddr]=useState("");
  const [connected,setConnected]=useState(false);
  const holdings=[{...ASSETS[0],qty:124.5},{...ASSETS[1],qty:1.82},{...ASSETS[2],qty:6.4}];
  const totalUsd=holdings.reduce((s,h)=>s+h.price*h.qty,0);
  return <div className="sc" style={{overflowY:"auto",height:"100%",animation:"rise .4s ease both"}}>
    <div style={{padding:"8px 18px 0"}}>
      <div style={{...D,fontSize:22,fontWeight:800,color:C.text}}>트래커</div>
      <div style={{...B,fontSize:12,color:C.muted,marginTop:2}}>내 지갑을 연결해 자산을 추적하세요.</div>
    </div>
    <div style={{margin:"12px 16px",borderRadius:14,padding:"12px 14px",background:"rgba(139,108,255,0.1)",border:`1px solid rgba(139,108,255,0.3)`,display:"flex",gap:10,alignItems:"flex-start"}}>
      <div style={{fontSize:16}}>🔐</div>
      <div style={{...B,fontSize:12,color:C.text,lineHeight:1.55}}><b>비수탁(Non-custodial)</b> — 본 앱은 귀하의 자산이나 개인키를 절대 보관하지 않습니다. 공개 지갑 주소로 잔고를 <b>조회</b>만 합니다.</div>
    </div>
    {!connected?<div style={{padding:"4px 16px"}}>
      <input value={addr} onChange={e=>setAddr(e.target.value)} placeholder="Stellar 지갑 주소 (G...)" style={{...M,width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.text,fontSize:12,outline:"none"}}/>
      <button onClick={()=>setConnected(true)} style={{width:"100%",marginTop:10,border:"none",cursor:"pointer",background:C.purple,color:"#fff",borderRadius:12,padding:13,...B,fontSize:14,fontWeight:700}}>주소로 조회하기 (데모)</button>
    </div>:<div style={{padding:"4px 16px"}}>
      <div style={{background:`linear-gradient(135deg,${C.card2},${C.card})`,borderRadius:18,padding:18,border:`1px solid ${C.border}`}}>
        <div style={{...B,fontSize:12,color:C.muted}}>총 평가액</div>
        <div style={{...M,fontSize:30,fontWeight:700,color:C.text}}>${totalUsd.toFixed(2)}</div>
        <div style={{...M,fontSize:13,color:C.gold}}>≈ {fmtPi(totalUsd/PI_USD)} Pi</div>
      </div>
      <div style={{marginTop:12}}>
        {holdings.map(h=><div key={h.id} style={{background:C.card,borderRadius:14,padding:13,marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontSize:20}}>{h.icon}</div>
          <div style={{flex:1}}>
            <div style={{...B,fontSize:13,fontWeight:600,color:C.text}}>{h.name}</div>
            <div style={{...M,fontSize:11,color:C.muted}}>{fmtPi(h.qty)} {h.sym}</div>
          </div>
          <div style={{...M,fontSize:13,color:C.text}}>${(h.price*h.qty).toFixed(2)}</div>
        </div>)}
      </div>
      <button onClick={()=>setConnected(false)} style={{width:"100%",marginTop:4,border:`1px solid ${C.border}`,cursor:"pointer",background:"transparent",color:C.muted,borderRadius:12,padding:11,...B,fontSize:13}}>연결 해제</button>
    </div>}
    <div style={{height:16}}/><Disclaimer small/><div style={{height:20}}/>
  </div>;
}

function About({premium}){
  const r=REVENUE;
  const totalMonth=r.mrr+r.affiliate+r.ads;
  const maxBar=Math.max(...r.monthly);
  const fiatRev=Math.round(r.mrr*r.payMethodSplit.fiat/100);
  const piRev=r.mrr-fiatRev;
  return <div className="sc" style={{overflowY:"auto",height:"100%",animation:"rise .4s ease both"}}>
    <div style={{padding:"8px 18px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div>
        <div style={{...D,fontSize:22,fontWeight:800,color:C.text}}>매출 대시보드</div>
        <div style={{...B,fontSize:12,color:C.muted,marginTop:2}}>관리자 전용 · 2026년 6월</div>
      </div>
      <Tag color={C.up} bg="rgba(61,220,151,0.15)">● 실시간</Tag>
    </div>
    <PiTestButton />
    <div style={{margin:"0 16px 12px",borderRadius:18,padding:18,background:`linear-gradient(135deg,${C.purpleDeep},${C.purple})`,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",right:-20,top:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.1)"}}/>
      <div style={{...B,fontSize:12,color:"rgba(255,255,255,0.8)"}}>이달 총 매출 (MRR + 제휴 + 광고)</div>
      <div style={{...D,fontSize:32,fontWeight:800,color:"#fff",marginTop:4}}>${totalMonth.toLocaleString()}</div>
      <div style={{...M,fontSize:12,color:C.up,marginTop:2}}>▲ 전월 대비 +13.7%</div>
    </div>
    <div style={{padding:"0 16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      {[
        {l:"활성 구독자",v:r.subscribers.toLocaleString(),s:`+${Math.round(r.subscribers*0.08)} 이번 달`,c:C.gold},
        {l:"무료 이용자",v:r.freeUsers.toLocaleString(),s:`전환율 ${(r.subscribers/r.freeUsers*100).toFixed(1)}%`,c:C.purple},
        {l:"월 반복매출",v:`$${r.mrr.toLocaleString()}`,s:"MRR",c:C.up},
        {l:"이탈률",v:`${r.churn}%`,s:"건강한 수준",c:C.down},
      ].map((k,i)=>
        <div key={i} style={{background:C.card,borderRadius:14,padding:14}}>
          <div style={{...B,fontSize:11,color:C.muted}}>{k.l}</div>
          <div style={{...D,fontSize:20,fontWeight:800,color:C.text,marginTop:3}}>{k.v}</div>
          <div style={{...M,fontSize:10,color:k.c,marginTop:2}}>{k.s}</div>
        </div>
      )}
    </div>
    <div style={{padding:"12px 16px 0"}}>
      <div style={{background:C.card,borderRadius:16,padding:16}}>
        <div style={{...B,fontSize:13,fontWeight:700,color:C.text,marginBottom:12}}>월별 MRR 추이</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:8,height:90}}>
          {r.monthly.map((v,i)=>
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{...M,fontSize:9,color:C.muted}}>{(v/1000).toFixed(1)}k</div>
              <div style={{width:"100%",height:`${(v/maxBar)*70}px`,background:i===r.monthly.length-1?`linear-gradient(180deg,${C.gold},${C.goldDeep})`:C.purpleDeep,borderRadius:"6px 6px 0 0",transition:"height .5s"}}/>
              <div style={{...M,fontSize:9,color:C.faint}}>{r.months[i]}</div>
            </div>
          )}
        </div>
      </div>
    </div>
    <div style={{padding:"12px 16px 0"}}>
      <div style={{background:C.card,borderRadius:16,padding:16}}>
        <div style={{...B,fontSize:13,fontWeight:700,color:C.text,marginBottom:10}}>구독 결제 수단 분포</div>
        <div style={{display:"flex",height:24,borderRadius:8,overflow:"hidden",marginBottom:10}}>
          <div style={{width:`${r.payMethodSplit.fiat}%`,background:C.gold,display:"grid",placeItems:"center",...M,fontSize:11,color:"#1A1505",fontWeight:700}}>{r.payMethodSplit.fiat}%</div>
          <div style={{width:`${r.payMethodSplit.pi}%`,background:C.purple,display:"grid",placeItems:"center",...M,fontSize:11,color:"#fff",fontWeight:700}}>{r.payMethodSplit.pi}%</div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",...B,fontSize:12}}>
          <span style={{color:C.gold}}>💳 법정화폐 ${fiatRev.toLocaleString()}</span>
          <span style={{color:C.purple}}>π Pi 결제 ${piRev.toLocaleString()}</span>
        </div>
      </div>
    </div>
    <div style={{padding:"12px 16px"}}>
      <div style={{...D,fontSize:14,fontWeight:700,color:C.text,margin:"4px 0 8px"}}>매출원별 분해</div>
      {[
        {i:"📚",t:"프리미엄 구독",v:r.mrr,tag:"주력",c:C.gold},
        {i:"🔗",t:"제휴 연결 수수료",v:r.affiliate,tag:"성장",c:C.up},
        {i:"📣",t:"광고",v:r.ads,tag:"보조",c:C.purple},
      ].map((row,i)=>{
        const pct=Math.round(row.v/totalMonth*100);
        return <div key={i} style={{background:C.card,borderRadius:14,padding:14,marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:18}}>{row.i}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{...B,fontSize:13,fontWeight:700,color:C.text}}>{row.t}</span>
                <span style={{...M,fontSize:13,color:row.c}}>${row.v.toLocaleString()}</span>
              </div>
              <div style={{marginTop:6}}><PBar pct={pct} color={row.c}/></div>
              <div style={{...M,fontSize:10,color:C.faint,marginTop:3}}>{pct}% · {row.tag} 매출</div>
            </div>
          </div>
        </div>;
      })}
    </div>
    <div style={{padding:"0 16px 16px"}}>
      <div style={{background:"rgba(255,107,129,0.08)",border:`1px solid rgba(255,107,129,0.25)`,borderRadius:16,padding:16}}>
        <div style={{...B,fontSize:13,fontWeight:700,color:C.down}}>비수탁 원칙 (우리가 하지 않는 것)</div>
        <div style={{marginTop:8}}>
          {["유저 자금 보관(수탁)","매매 대행 / 거래소 운영","수익률·이자 약속","출금 수수료 부과"].map((n,i)=><div key={i} style={{...B,fontSize:12.5,color:C.text,padding:"4px 0"}}>✕ {n}</div>)}
        </div>
        <div style={{...B,fontSize:11,color:C.faint,marginTop:8,lineHeight:1.5}}>매출은 구독·제휴·광고에서만 발생합니다. 라이선스가 필요한 영역은 인가받은 파트너에게 위임합니다.</div>
      </div>
    </div>
    <div style={{height:20}}/>
  </div>;
}

const TABS=[
  {id:"home",label:"홈",icon:"◈"},
  {id:"market",label:"마켓",icon:"▤"},
  {id:"learn",label:"배우기",icon:"✦"},
  {id:"tracker",label:"트래커",icon:"◎"},
  {id:"about",label:"매출",icon:"❖"},
];

function AdBanner({onUpgrade}){
  return <div style={{margin:"0 12px 8px",borderRadius:12,padding:"10px 12px",background:C.card2,border:`1px dashed ${C.borderStrong}`,display:"flex",alignItems:"center",gap:10}}>
    <div style={{...M,fontSize:9,color:C.faint,border:`1px solid ${C.faint}`,borderRadius:4,padding:"2px 4px"}}>AD</div>
    <div style={{flex:1,...B,fontSize:11.5,color:C.muted,lineHeight:1.4}}>광고 없이 학습하고 싶으세요? <span style={{color:C.gold,fontWeight:700}}>프리미엄</span>으로 전환하세요.</div>
    <button onClick={onUpgrade} style={{border:"none",background:C.gold,color:"#1A1505",borderRadius:8,padding:"6px 10px",cursor:"pointer",...B,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>제거</button>
  </div>;
}

export default function App(){
  const [tab,setTab]=useState("home");
  const [view,setView]=useState({screen:"home",arg:null});
  const [premium,setPremium]=useState(false);
  const [globalPaywall,setGlobalPaywall]=useState(false);
  const go=(screen,arg)=>setView({screen,arg});
  const navTo=t=>{setTab(t);setView({screen:t,arg:null});};

  let content;
  if(view.screen==="detail") content=<Detail id={view.arg} back={()=>go(tab,null)}/>;
  else if(tab==="home") content=<Home go={go} setTab={navTo}/>;
  else if(tab==="market") content=<Market go={go}/>;
  else if(tab==="learn") content=<Learn premium={premium} setPremium={setPremium}/>;
  else if(tab==="tracker") content=<Tracker/>;
  else if(tab==="about") content=<About premium={premium}/>;

  const showAd=!premium&&(tab==="home"||tab==="market")&&view.screen!=="detail";

  return <div style={{...B,minHeight:"100vh",background:"#000",display:"grid",placeItems:"center",padding:16}}>
    <style>{FONT}</style>
    <div style={{width:"100%",maxWidth:390,height:820,maxHeight:"95vh",background:`radial-gradient(120% 80% at 50% 0%,${C.bg2},${C.bg})`,borderRadius:34,overflow:"hidden",position:"relative",border:`1px solid ${C.borderStrong}`,boxShadow:"0 30px 80px rgba(0,0,0,0.65)",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"14px 18px 10px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:9,background:`linear-gradient(135deg,${C.purple},${C.purpleDeep})`,display:"grid",placeItems:"center",color:"#fff",fontWeight:800,...D,fontSize:14}}>π</div>
          <div style={{...D,fontSize:15,fontWeight:800,color:C.text,letterSpacing:-0.3}}>RWA <span style={{color:C.gold}}>Academy</span></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {premium
            ? <Tag color={C.gold} bg={`${C.gold}22`}>👑 PRO</Tag>
            : <button onClick={()=>setGlobalPaywall(true)} style={{border:`1px solid ${C.gold}`,background:"transparent",color:C.gold,borderRadius:999,padding:"4px 10px",cursor:"pointer",...B,fontSize:10.5,fontWeight:700}}>업그레이드</button>
          }
        </div>
      </div>
      <div style={{flex:1,overflow:"hidden",position:"relative",display:"flex",flexDirection:"column"}}>
        {showAd&&<AdBanner onUpgrade={()=>setGlobalPaywall(true)}/>}
        <div style={{flex:1,overflow:"hidden",position:"relative"}}>{content}</div>
      </div>
      <div style={{flexShrink:0,height:62,background:"rgba(10,9,18,0.9)",backdropFilter:"blur(16px)",borderTop:`1px solid ${C.border}`,display:"flex"}}>
        {TABS.map(t=>{
          const active=tab===t.id&&view.screen!=="detail";
          return <button key={t.id} onClick={()=>navTo(t.id)} style={{flex:1,border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3}}>
            <span style={{fontSize:16,color:active?C.purple:C.faint}}>{t.icon}</span>
            <span style={{...B,fontSize:10,fontWeight:active?700:500,color:active?C.text:C.faint}}>{t.label}</span>
          </button>;
        })}
      </div>
      {globalPaywall&&<Paywall onClose={()=>setGlobalPaywall(false)} onSubscribe={()=>{setPremium(true);setGlobalPaywall(false);}}/>}
    </div>
  </div>;
}
