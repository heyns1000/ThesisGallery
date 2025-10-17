import { db } from './db';
import { ecosystemApps } from '@shared/schema';

const apps = [
  {
    id: 'b9b01291-2c5b-4e76-b7ab-290e86c7e97d',
    appName: 'Storage',
    category: 'utilities',
    status: 'not deployed',
    lastUpdated: new Date('2025-10-11T11:53:47.565Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/Storage'
  },
  {
    id: '2c8fb2a5-e707-4c4b-8446-00d137aa2094',
    appName: 'heynsschoeman-08-25 (2)',
    category: 'development',
    status: 'not deployed',
    lastUpdated: new Date('2025-10-11T11:51:52.215Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/heynsschoeman-08-25 (2)'
  },
  {
    id: '7e6e94ce-4950-4b0e-92db-cd7d6a2a7425',
    appName: '🏠 FAA Real Estate AI™ Property Intelligence | Legal | Build',
    category: 'real_estate',
    status: 'not deployed',
    lastUpdated: new Date('2025-10-10T12:32:51.228Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/🏠 FAA Real Estate AI™ Property Intelligence | Legal | Build'
  },
  {
    id: 'f00a6c7d-bdd2-4540-b578-6baeff911dea',
    appName: 'Fruitful Phyton backend',
    category: 'fruitful_ecosystem',
    status: 'suspended',
    lastUpdated: new Date('2025-10-09T12:02:41.119Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/Fruitful Phyton backend'
  },
  {
    id: '484bff7a-d3e5-430f-9e8a-ee1b4d3594b0',
    appName: 'Partnership Intergration injection engin rating model',
    category: 'ai_intelligence',
    status: 'not deployed',
    lastUpdated: new Date('2025-10-07T21:10:03.468Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/Partnership Intergration injection engin rating model'
  },
  {
    id: '8eb690a4-558d-46bd-97e1-1d962034e1b8',
    appName: 'HealthTrack',
    category: 'ai_intelligence',
    status: 'not deployed',
    lastUpdated: new Date('2025-10-07T20:09:24.977Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/HealthTrack'
  },
  {
    id: 'ba648e28-0c89-4160-a9ca-c634b60cf3d4',
    appName: 'AICreator',
    category: 'ai_intelligence',
    status: 'not deployed',
    lastUpdated: new Date('2025-10-07T19:01:40.709Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/AICreator'
  },
  {
    id: 'c6d50678-300c-4430-b137-e40e3136fd0b',
    appName: 'CornexConnect',
    category: 'connectivity',
    status: 'not deployed',
    lastUpdated: new Date('2025-10-03T16:35:57.865Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/CornexConnect'
  },
  {
    id: 'f9c6dd49-f323-4d6d-ad26-8a46b0511890',
    appName: 'OmniTreaty',
    category: 'connectivity',
    status: 'not deployed',
    lastUpdated: new Date('2025-10-03T16:31:57.221Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/OmniTreaty'
  },
  {
    id: 'd0ee1139-7448-4bea-9f3f-2347b769d1b2',
    appName: 'DoodleDash (1)',
    category: 'creative',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-25T21:40:22.318Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/DoodleDash (1)'
  },
  {
    id: 'e7300f80-edff-4045-b1ec-28d791f853a0',
    appName: '🌐 VaultMesh™',
    category: 'connectivity',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-25T21:28:27.622Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/🌐 VaultMesh™'
  },
  {
    id: '11cc86ae-5113-47ab-b419-2006b4e7952a',
    appName: 'FAA Real Estate AI™',
    category: 'real_estate',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-25T20:52:05.428Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/FAA Real Estate AI™'
  },
  {
    id: '49eb584f-57b9-4ea5-8a8e-c756600566fd',
    appName: 'Fruitful Global SecureSign™ NDA Portal',
    category: 'fruitful_ecosystem',
    status: 'suspended',
    lastUpdated: new Date('2025-09-25T20:49:30.318Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/Fruitful Global SecureSign™ NDA Portal'
  },
  {
    id: '4fb1cc1d-95ad-45df-912f-a5a6f62456c3',
    appName: 'SeedwaveConnect',
    category: 'connectivity',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-25T19:59:41.529Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/SeedwaveConnect'
  },
  {
    id: '818d9ec8-56d8-4563-ad70-860edf0a2444',
    appName: '🔹ScrollBinder_One :: SB1::AtomicScrollEngine',
    category: 'development',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-19T14:20:59.072Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/🔹ScrollBinder_One :: SB1::AtomicScrollEngine'
  },
  {
    id: '67337d1f-ed8b-4162-8c5b-e5aaaadd433e',
    appName: 'ReplitMission',
    category: 'development',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-19T14:17:24.693Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/ReplitMission'
  },
  {
    id: 'd9314dd3-9e81-47de-b856-cf45bcb38549',
    appName: 'ZohoConnect',
    category: 'connectivity',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-19T14:15:44.238Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/ZohoConnect'
  },
  {
    id: '29efbde5-a707-4569-ac9a-f80f26eb9df2',
    appName: 'Fruitful Global Backend',
    category: 'fruitful_ecosystem',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-19T12:50:00.601Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/Fruitful Global Backend'
  },
  {
    id: '8683e986-c5b5-42b9-a15e-a1354d51bac6',
    appName: '📜Welcome to Fruitful',
    category: 'fruitful_ecosystem',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-12T14:30:38.706Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/📜Welcome to Fruitful'
  },
  {
    id: 'd19b2ca3-a8e6-48a2-a737-01c941a70350',
    appName: 'PentaWeb',
    category: 'development',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-11T12:38:29.630Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/PentaWeb'
  },
  {
    id: 'f5951869-9a60-4c3e-9204-294cede62c0c',
    appName: 'ReplImporter',
    category: 'utilities',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-11T10:41:48.033Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/ReplImporter'
  },
  {
    id: '236713b2-d3b1-4995-a4d0-98a2f85863e5',
    appName: 'Fruitful Payroll OS',
    category: 'fruitful_ecosystem',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-10T17:08:21.285Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/Fruitful Payroll OS'
  },
  {
    id: '09641c8c-e9b4-4e79-a7f9-a34048feaf11',
    appName: 'Agent University',
    category: 'ai_intelligence',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-08T23:55:47.223Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/Agent University'
  },
  {
    id: 'aa067d66-7b3e-4689-a983-7410a8105671',
    appName: 'ProposalCare',
    category: 'business_tools',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-08T20:33:54.553Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/ProposalCare'
  },
  {
    id: 'dfa4cc61-87ec-4547-8cbb-cba84756ad7a',
    appName: 'RoadmapPro',
    category: 'business_tools',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-08T19:00:34.545Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/RoadmapPro'
  },
  {
    id: 'dcc82ba0-af99-4a6f-8350-1e75e33a2e45',
    appName: 'TextReader',
    category: 'utilities',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-07T04:16:47.860Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/TextReader'
  },
  {
    id: '61605fb2-c6e8-4092-9047-2c24866907b7',
    appName: 'Game Build',
    category: 'creative',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-07T04:09:30.031Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/Game Build'
  },
  {
    id: '9de696ec-29e0-4b32-bff1-7652fffafb51',
    appName: 'PaypalBackend',
    category: 'business_tools',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-06T11:34:02.136Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/PaypalBackend'
  },
  {
    id: '6c0119b3-94a2-481a-a63a-9527fb11281e',
    appName: '🏛️ Municipal Intelligence',
    category: 'ai_intelligence',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-05T14:58:13.174Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/🏛️ Municipal Intelligence'
  },
  {
    id: '7b469bc8-77a5-4542-8465-ba267ba2b198',
    appName: 'FruitfulAssist',
    category: 'fruitful_ecosystem',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-05T13:41:33.707Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/FruitfulAssist'
  },
  {
    id: '82c85828-929b-43e9-9a89-eab80f45a849',
    appName: 'OmniLedger',
    category: 'business_tools',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-04T16:18:19.656Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/OmniLedger'
  },
  {
    id: '57b2df95-0ba7-4df0-9f02-fe5ede81b4c5',
    appName: 'Frtuiful Kitchens',
    category: 'fruitful_ecosystem',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-04T16:14:24.334Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/Frtuiful Kitchens'
  },
  {
    id: 'faaff2aa-20ef-481a-805e-223830a9a489',
    appName: 'Fruitful Coffee',
    category: 'fruitful_ecosystem',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-01T15:16:40.902Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/Fruitful Coffee'
  },
  {
    id: '0c6555bf-7885-4d5f-8294-04e74e2c4dfc',
    appName: 'PlaylistBees',
    category: 'creative',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-28T19:32:15.000Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/PlaylistBees'
  },
  {
    id: '0bafcbb7-8b1b-4264-ace9-baf3983c3d15',
    appName: 'SigBuilder',
    category: 'creative',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-27T21:08:10.370Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/SigBuilder'
  },
  {
    id: 'b4ffc184-9288-42bd-8a99-f4678d94801c',
    appName: 'Audiomesh',
    category: 'utilities',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-27T20:04:33.705Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/Audiomesh'
  },
  {
    id: '7d097a12-db37-4af8-90f4-c683b364f23f',
    appName: '🌱 Fruitful™ | Global Agriculture Dashboard',
    category: 'fruitful_ecosystem',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-26T01:20:21.300Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/🌱 Fruitful™ | Global Agriculture Dashboard'
  },
  {
    id: '6652cabb-f7f3-4de3-9d3e-b7d2859690aa',
    appName: 'CodeNest™ Partnership Proposal',
    category: 'fruitful_ecosystem',
    status: 'suspended',
    lastUpdated: new Date('2025-08-25T20:13:13.567Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/CodeNest™ Partnership Proposal'
  },
  {
    id: '9eac3796-5d42-4b33-b564-e9d076c2b09e',
    appName: 'Fruitful Home',
    category: 'fruitful_ecosystem',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-25T15:12:49.998Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/Fruitful Home'
  },
  {
    id: 'f78918ed-ca08-416d-9ac4-16d0e07943c4',
    appName: 'WorkSpaceMind',
    category: 'business_tools',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-24T17:27:45.964Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/WorkSpaceMind'
  },
  {
    id: 'edd1f941-f555-45a1-9edf-e6d2ae686e6d',
    appName: 'LinkShorten',
    category: 'utilities',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-23T10:42:25.624Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/LinkShorten'
  },
  {
    id: 'ae8e971f-0bb7-4446-a547-e0aadc3efe51',
    appName: '🌍 FAA™ Mining Intelligence Grid',
    category: 'ai_intelligence',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-15T18:18:01.526Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/🌍 FAA™ Mining Intelligence Grid'
  },
  {
    id: '1e5d3b08-b0c2-4ce2-a31d-6c3dddd20896',
    appName: 'WebPageBuilder',
    category: 'development',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-15T14:59:33.969Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/WebPageBuilder'
  },
  {
    id: '8db49430-343a-4e36-9a89-56bd52398c62',
    appName: '🔬Fruitful Global CodeNest Enterprise Platform',
    category: 'fruitful_ecosystem',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-13T19:48:25.078Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/🔬Fruitful Global CodeNest Enterprise Platform'
  },
  {
    id: 'f4eee163-b75c-4d52-80f7-72041f5d071b',
    appName: 'AuthFlow',
    category: 'development',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-13T16:27:46.679Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/AuthFlow'
  },
  {
    id: '7cac080d-637a-43d8-93de-c0f3b0bc056c',
    appName: 'heynsschoeman-09-07 (1)',
    category: 'development',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-19T13:39:43.369Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/heynsschoeman-09-07 (1)'
  },
  {
    id: '427f856e-ef35-4a4a-8fc1-fc527078e23f',
    appName: 'VaultPrayer',
    category: 'utilities',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-19T12:43:41.835Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/VaultPrayer'
  },
  {
    id: '3b01e5fc-e945-44ac-87a9-26adc52b2162',
    appName: 'heynsschoeman-09-11',
    category: 'development',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-11T11:48:44.772Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/heynsschoeman-09-11'
  },
  {
    id: 'd579e8bf-7e0e-469d-a231-fcf47c6885c3',
    appName: 'SilentOrbitNode',
    category: 'connectivity',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-08T23:29:59.359Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/SilentOrbitNode'
  },
  {
    id: '4e8c5949-1e00-491a-b2db-81aec6967d44',
    appName: '11 Million followers',
    category: 'business_tools',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-08T23:28:13.665Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/11 Million followers'
  },
  {
    id: 'b0800951-9267-4902-bce6-787b228c2c89',
    appName: '☯ Lesotho Heritage',
    category: 'creative',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-07T09:35:22.933Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/☯ Lesotho Heritage'
  },
  {
    id: '457d5ec2-e3d6-45bd-90ee-c5c1328f9a88',
    appName: 'Hello there! What kind of software project are you looking',
    category: 'development',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-07T09:31:25.415Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/Hello there! What kind of software project are you looking'
  },
  {
    id: 'd55d356f-3432-490e-b033-e0478c8e91f8',
    appName: 'BushPortal',
    category: 'utilities',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-07T07:35:31.334Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/BushPortal'
  },
  {
    id: 'f06948c9-7b7f-499a-a80e-c5abaf9a0cc2',
    appName: 'Justlink',
    category: 'utilities',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-07T02:31:49.748Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/Justlink'
  },
  {
    id: '3107146a-2111-4152-a4c7-e767ff084bc4',
    appName: 'omnigrid',
    category: 'development',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-06T12:10:51.287Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/omnigrid'
  },
  {
    id: 'af447cfa-c0a4-4f44-872d-6083e2ed7e73',
    appName: 'BaobabTree',
    category: 'creative',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-05T06:44:16.387Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/BaobabTree'
  },
  {
    id: '268b02f4-7556-4e5a-8dfd-e0ba9aa14476',
    appName: 'AviationIndex',
    category: 'utilities',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-05T05:17:07.320Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/AviationIndex'
  },
  {
    id: 'c1104749-a278-4adf-aff8-ef9b6c80610d',
    appName: 'LaundroAI',
    category: 'ai_intelligence',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-03T17:19:18.052Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/LaundroAI'
  },
  {
    id: 'ff851659-5c22-483a-ba59-4f55d9691886',
    appName: 'sovreign srolls',
    category: 'development',
    status: 'not deployed',
    lastUpdated: new Date('2025-09-03T15:15:32.865Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/sovreign srolls'
  },
  {
    id: '14e4ff76-e800-4426-89c5-cad61c039cae',
    appName: 'heynsschoeman-08-24 (1)',
    category: 'development',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-26T01:07:15.233Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/heynsschoeman-08-24 (1)'
  },
  {
    id: '24536474-ae38-4910-804f-db702803dd85',
    appName: 'heynsschoeman-08-25 (1)',
    category: 'development',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-25T01:17:13.430Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/heynsschoeman-08-25 (1)'
  },
  {
    id: '78f90f3c-2304-4548-ae77-a6037ee5c762',
    appName: 'heynsschoeman-08-25',
    category: 'development',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-25T01:13:14.437Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/heynsschoeman-08-25'
  },
  {
    id: '3b0f2741-612b-47a2-84af-107572c9fcd2',
    appName: 'heynsschoeman-08-13',
    category: 'development',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-24T17:32:03.846Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/heynsschoeman-08-13'
  },
  {
    id: 'c7a86cba-c878-4b01-8ba0-e027b892c747',
    appName: 'heynsschoeman-08-24',
    category: 'development',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-24T13:54:36.823Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/heynsschoeman-08-24'
  },
  {
    id: '6bfbb87f-5965-4b91-8b0a-98550daca60e',
    appName: 'CornexSite',
    category: 'development',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-23T19:01:09.757Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/CornexSite'
  },
  {
    id: 'f29722ed-3f66-4b82-967f-baa9d4af9904',
    appName: 'KitchenBuilder',
    category: 'business_tools',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-23T18:30:45.331Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/KitchenBuilder'
  },
  {
    id: 'a303d341-67cc-4564-816f-8cf5eb487d48',
    appName: 'Routemesh',
    category: 'connectivity',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-23T14:03:32.843Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/Routemesh'
  },
  {
    id: '82f13474-799f-4147-8af9-f264b2cd515a',
    appName: 'PilchardSpoon',
    category: 'utilities',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-23T06:20:47.308Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/PilchardSpoon'
  },
  {
    id: 'fb15cacd-3087-4bc6-bbbc-9f05a8fb150c',
    appName: 'WaveHub',
    category: 'connectivity',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-23T03:23:19.318Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/WaveHub'
  },
  {
    id: '460ee100-9703-4251-bd39-0f66116bb11b',
    appName: 'RenovateLink',
    category: 'business_tools',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-22T00:19:14.071Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/RenovateLink'
  },
  {
    id: 'e5740d17-712b-4ec0-a0d9-8bf389ccfe8f',
    appName: 'gaming sector',
    category: 'creative',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-19T19:25:41.041Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/gaming sector'
  },
  {
    id: '72314bd4-ee84-450e-acfd-21b4c19142a3',
    appName: 'ClientMine',
    category: 'business_tools',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-15T18:09:36.998Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/ClientMine'
  },
  {
    id: '77513d18-4a2f-4304-8f54-e0b04e50fc98',
    appName: 'Madisha Security',
    category: 'utilities',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-15T11:11:28.965Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/Madisha Security'
  },
  {
    id: '132c8c1e-811d-44ae-b3c7-46e2d6ec532e',
    appName: 'SeedShake',
    category: 'utilities',
    status: 'not deployed',
    lastUpdated: new Date('2025-08-12T21:15:21.010Z'),
    replitUrl: 'https://replit.com/@heynsschoeman/SeedShake'
  }
];

export async function main() {
  try {
    console.log('🌱 Starting Ecosystem Apps seed...');
    console.log(`📊 Seeding ${apps.length} Replit apps into the ecosystem_apps table`);

    // Fix URL encoding for all apps
    const appsWithEncodedUrls = apps.map(app => ({
      ...app,
      replitUrl: `https://replit.com/@heynsschoeman/${encodeURIComponent(app.appName)}`
    }));

    const result = await db
      .insert(ecosystemApps)
      .values(appsWithEncodedUrls)
      .onConflictDoUpdate({
        target: ecosystemApps.id,
        set: {
          appName: ecosystemApps.appName,
          category: ecosystemApps.category,
          status: ecosystemApps.status,
          lastUpdated: ecosystemApps.lastUpdated,
          replitUrl: ecosystemApps.replitUrl,
          updatedAt: new Date()
        }
      });

    console.log('✅ Ecosystem Apps seed completed successfully!');
    console.log(`📈 Total apps seeded: ${apps.length}`);
    
    console.log('\n📋 Apps by category:');
    const categories = apps.reduce((acc, app) => {
      acc[app.category] = (acc[app.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} apps`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding ecosystem apps:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
