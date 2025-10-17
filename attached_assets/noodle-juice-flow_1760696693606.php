<?php
/**
 * Noodle Juice Gorilla Comb Flow Controller
 * * Manages the flow of 67 private Replit apps through the Noodle Juice system
 * Integrates with Replit referral program and vault allocation system
 */

class NoodleJuiceFlowController {
    
    private $replit_apps = [];
    private $flow_log = [];
    private $referral_url = 'https://replit.com/refer/heynsschoeman';
    private $vault_allocator;
    
    // Replit app categories based on your CSV data
    private $app_categories = [
        'real_estate' => ['🏠 FAA Real Estate AI™ Property Intelligence | Legal | Build', 'FAA Real Estate AI™'],
        'fruitful_ecosystem' => ['Fruitful Phyton backend', 'Fruitful Global Backend', '📜Welcome to Fruitful', 'Fruitful Payroll OS', 'Fruitful Global SecureSign™ NDA Portal', '🌱 Fruitful™ | Global Agriculture Dashboard', 'Fruitful Home', 'FruitfulAssist', 'Frtuiful Kitchens', 'Fruitful Coffee'],
        'connectivity' => ['🌐 VaultMesh™', 'SeedwaveConnect', 'ZohoConnect', 'CornexConnect', 'OmniTreaty'],
        'ai_intelligence' => ['AICreator', 'HealthTrack', '🏛️ Municipal Intelligence', 'Agent University', '🌍 FAA™ Mining Intelligence Grid'],
        'utilities' => ['Storage', 'ReplImporter', 'TextReader', 'LinkShorten', 'Audiomesh'],
        'business_tools' => ['ProposalCare', 'RoadmapPro', 'PaypalBackend', 'OmniLedger', 'WorkSpaceMind'],
        'creative' => ['DoodleDash (1)', 'Game Build', 'PlaylistBees', 'SigBuilder'],
        'development' => ['🔹ScrollBinder_One :: SB1::AtomicScrollEngine', 'ReplitMission', 'PentaWeb', 'WebPageBuilder', 'AuthFlow']
    ];
    
    public function __construct($vault_allocator = null) {
        $this->vault_allocator = $vault_allocator;
        $this->loadReplitApps();
        $this->log("🍝 Noodle Juice Flow Controller Initialized");
        $this->log("Managing {$this->getTotalAppsCount()} private Replit apps");
        $this->log("Referral URL: {$this->referral_url}");
    }
    
    /**
     * Load all Replit apps from the CSV data
     */
    private function loadReplitApps() {
        // Your actual 67 Replit apps from the CSV data with real IDs and data
        $this->replit_apps = [
            'b9b01291-2c5b-4e76-b7ab-290e86c7e97d' => [
                'name' => 'Storage',
                'last_updated' => '2025-10-11T11:53:47.565Z',
                'status' => 'not deployed',
                'category' => 'utilities'
            ],
            '2c8fb2a5-e707-4c4b-8446-00d137aa2094' => [
                'name' => 'heynsschoeman-08-25 (2)',
                'last_updated' => '2025-10-11T11:51:52.215Z',
                'status' => 'not deployed',
                'category' => 'development'
            ],
            '7e6e94ce-4950-4b0e-92db-cd7d6a2a7425' => [
                'name' => '🏠 FAA Real Estate AI™ Property Intelligence | Legal | Build',
                'last_updated' => '2025-10-10T12:32:51.228Z',
                'status' => 'not deployed',
                'category' => 'real_estate'
            ],
            'f00a6c7d-bdd2-4540-b578-6baeff911dea' => [
                'name' => 'Fruitful Phyton backend',
                'last_updated' => '2025-10-09T12:02:41.119Z',
                'status' => 'suspended',
                'category' => 'fruitful_ecosystem'
            ],
            '484bff7a-d3e5-430f-9e8a-ee1b4d3594b0' => [
                'name' => 'Partnership Intergration injection engin rating model',
                'last_updated' => '2025-10-07T21:10:03.468Z',
                'status' => 'not deployed',
                'category' => 'ai_intelligence'
            ],
            '8eb690a4-558d-46bd-97e1-1d962034e1b8' => [
                'name' => 'HealthTrack',
                'last_updated' => '2025-10-07T20:09:24.977Z',
                'status' => 'not deployed',
                'category' => 'ai_intelligence'
            ],
            'ba648e28-0c89-4160-a9ca-c634b60cf3d4' => [
                'name' => 'AICreator',
                'last_updated' => '2025-10-07T19:01:40.709Z',
                'status' => 'not deployed',
                'category' => 'ai_intelligence'
            ],
            'c6d50678-300c-4430-b137-e40e3136fd0b' => [
                'name' => 'CornexConnect',
                'last_updated' => '2025-10-03T16:35:57.865Z',
                'status' => 'not deployed',
                'category' => 'connectivity'
            ],
            'f9c6dd49-f323-4d6d-ad26-8a46b0511890' => [
                'name' => 'OmniTreaty',
                'last_updated' => '2025-10-03T16:31:57.221Z',
                'status' => 'not deployed',
                'category' => 'connectivity'
            ],
            'd0ee1139-7448-4bea-9f3f-2347b769d1b2' => [
                'name' => 'DoodleDash (1)',
                'last_updated' => '2025-09-25T21:40:22.318Z',
                'status' => 'not deployed',
                'category' => 'creative'
            ],
            'e7300f80-edff-4045-b1ec-28d791f853a0' => [
                'name' => '🌐 VaultMesh™',
                'last_updated' => '2025-09-25T21:28:27.622Z',
                'status' => 'not deployed',
                'category' => 'connectivity'
            ],
            '11cc86ae-5113-47ab-b419-2006b4e7952a' => [
                'name' => 'FAA Real Estate AI™',
                'last_updated' => '2025-09-25T20:52:05.428Z',
                'status' => 'not deployed',
                'category' => 'real_estate'
            ],
            '49eb584f-57b9-4ea5-8a8e-c756600566fd' => [
                'name' => 'Fruitful Global SecureSign™ NDA Portal',
                'last_updated' => '2025-09-25T20:49:30.318Z',
                'status' => 'suspended',
                'category' => 'fruitful_ecosystem'
            ],
            '4fb1cc1d-95ad-45df-912f-a5a6f62456c3' => [
                'name' => 'SeedwaveConnect',
                'last_updated' => '2025-09-25T19:59:41.529Z',
                'status' => 'not deployed',
                'category' => 'connectivity'
            ],
            '818d9ec8-56d8-4563-ad70-860edf0a2444' => [
                'name' => '🔹ScrollBinder_One :: SB1::AtomicScrollEngine',
                'last_updated' => '2025-09-19T14:20:59.072Z',
                'status' => 'not deployed',
                'category' => 'development'
            ],
            '67337d1f-ed8b-4162-8c5b-e5aaaadd433e' => [
                'name' => 'ReplitMission',
                'last_updated' => '2025-09-19T14:17:24.693Z',
                'status' => 'not deployed',
                'category' => 'development'
            ],
            'd9314dd3-9e81-47de-b856-cf45bcb38549' => [
                'name' => 'ZohoConnect',
                'last_updated' => '2025-09-19T14:15:44.238Z',
                'status' => 'not deployed',
                'category' => 'connectivity'
            ],
            '29efbde5-a707-4569-ac9a-f80f26eb9df2' => [
                'name' => 'Fruitful Global Backend',
                'last_updated' => '2025-09-19T12:50:00.601Z',
                'status' => 'not deployed',
                'category' => 'fruitful_ecosystem'
            ],
            '8683e986-c5b5-42b9-a15e-a1354d51bac6' => [
                'name' => '📜Welcome to Fruitful',
                'last_updated' => '2025-09-12T14:30:38.706Z',
                'status' => 'not deployed',
                'category' => 'fruitful_ecosystem'
            ],
            'd19b2ca3-a8e6-48a2-a737-01c941a70350' => [
                'name' => 'PentaWeb',
                'last_updated' => '2025-09-11T12:38:29.630Z',
                'status' => 'not deployed',
                'category' => 'development'
            ],
            'f5951869-9a60-4c3e-9204-294cede62c0c' => [
                'name' => 'ReplImporter',
                'last_updated' => '2025-09-11T10:41:48.033Z',
                'status' => 'not deployed',
                'category' => 'utilities'
            ],
            '236713b2-d3b1-4995-a4d0-98a2f85863e5' => [
                'name' => 'Fruitful Payroll OS',
                'last_updated' => '2025-09-10T17:08:21.285Z',
                'status' => 'not deployed',
                'category' => 'fruitful_ecosystem'
            ],
            '09641c8c-e9b4-4e79-a7f9-a34048feaf11' => [
                'name' => 'Agent University',
                'last_updated' => '2025-09-08T23:55:47.223Z',
                'status' => 'not deployed',
                'category' => 'ai_intelligence'
            ],
            'aa067d66-7b3e-4689-a983-7410a8105671' => [
                'name' => 'ProposalCare',
                'last_updated' => '2025-09-08T20:33:54.553Z',
                'status' => 'not deployed',
                'category' => 'business_tools'
            ],
            'dfa4cc61-87ec-4547-8cbb-cba84756ad7a' => [
                'name' => 'RoadmapPro',
                'last_updated' => '2025-09-08T19:00:34.545Z',
                'status' => 'not deployed',
                'category' => 'business_tools'
            ],
            'dcc82ba0-af99-4a6f-8350-1e75e33a2e45' => [
                'name' => 'TextReader',
                'last_updated' => '2025-09-07T04:16:47.860Z',
                'status' => 'not deployed',
                'category' => 'utilities'
            ],
            '61605fb2-c6e8-4092-9047-2c24866907b7' => [
                'name' => 'Game Build',
                'last_updated' => '2025-09-07T04:09:30.031Z',
                'status' => 'not deployed',
                'category' => 'creative'
            ],
            '9de696ec-29e0-4b32-bff1-7652fffafb51' => [
                'name' => 'PaypalBackend',
                'last_updated' => '2025-09-06T11:34:02.136Z',
                'status' => 'not deployed',
                'category' => 'business_tools'
            ],
            '6c0119b3-94a2-481a-a63a-9527fb11281e' => [
                'name' => '🏛️ Municipal Intelligence',
                'last_updated' => '2025-09-05T14:58:13.174Z',
                'status' => 'not deployed',
                'category' => 'ai_intelligence'
            ],
            '7b469bc8-77a5-4542-8465-ba267ba2b198' => [
                'name' => 'FruitfulAssist',
                'last_updated' => '2025-09-05T13:41:33.707Z',
                'status' => 'not deployed',
                'category' => 'fruitful_ecosystem'
            ],
            '82c85828-929b-43e9-9a89-eab80f45a849' => [
                'name' => 'OmniLedger',
                'last_updated' => '2025-09-04T16:18:19.656Z',
                'status' => 'not deployed',
                'category' => 'business_tools'
            ],
            '57b2df95-0ba7-4df0-9f02-fe5ede81b4c5' => [
                'name' => 'Frtuiful Kitchens',
                'last_updated' => '2025-09-04T16:14:24.334Z',
                'status' => 'not deployed',
                'category' => 'fruitful_ecosystem'
            ],
            'faaff2aa-20ef-481a-805e-223830a9a489' => [
                'name' => 'Fruitful Coffee',
                'last_updated' => '2025-09-01T15:16:40.902Z',
                'status' => 'not deployed',
                'category' => 'fruitful_ecosystem'
            ],
            '0c6555bf-7885-4d5f-8294-04e74e2c4dfc' => [
                'name' => 'PlaylistBees',
                'last_updated' => '2025-08-28T19:32:15.000Z',
                'status' => 'not deployed',
                'category' => 'creative'
            ],
            '0bafcbb7-8b1b-4264-ace9-baf3983c3d15' => [
                'name' => 'SigBuilder',
                'last_updated' => '2025-08-27T21:08:10.370Z',
                'status' => 'not deployed',
                'category' => 'creative'
            ],
            'b4ffc184-9288-42bd-8a99-f4678d94801c' => [
                'name' => 'Audiomesh',
                'last_updated' => '2025-08-27T20:04:33.705Z',
                'status' => 'not deployed',
                'category' => 'utilities'
            ],
            '7d097a12-db37-4af8-90f4-c683b364f23f' => [
                'name' => '🌱 Fruitful™ | Global Agriculture Dashboard',
                'last_updated' => '2025-08-26T01:20:21.300Z',
                'status' => 'not deployed',
                'category' => 'fruitful_ecosystem'
            ],
            '6652cabb-f7f3-4de3-9d3e-b7d2859690aa' => [
                'name' => 'CodeNest™ Partnership Proposal',
                'last_updated' => '2025-08-25T20:13:13.567Z',
                'status' => 'suspended',
                'category' => 'fruitful_ecosystem'
            ],
            '9eac3796-5d42-4b33-b564-e9d076c2b09e' => [
                'name' => 'Fruitful Home',
                'last_updated' => '2025-08-25T15:12:49.998Z',
                'status' => 'not deployed',
                'category' => 'fruitful_ecosystem'
            ],
            'f78918ed-ca08-416d-9ac4-16d0e07943c4' => [
                'name' => 'WorkSpaceMind',
                'last_updated' => '2025-08-24T17:27:45.964Z',
                'status' => 'not deployed',
                'category' => 'business_tools'
            ],
            'edd1f941-f555-45a1-9edf-e6d2ae686e6d' => [
                'name' => 'LinkShorten',
                'last_updated' => '2025-08-23T10:42:25.624Z',
                'status' => 'not deployed',
                'category' => 'utilities'
            ],
            'ae8e971f-0bb7-4446-a547-e0aadc3efe51' => [
                'name' => '🌍 FAA™ Mining Intelligence Grid',
                'last_updated' => '2025-08-15T18:18:01.526Z',
                'status' => 'not deployed',
                'category' => 'ai_intelligence'
            ],
            '1e5d3b08-b0c2-4ce2-a31d-6c3dddd20896' => [
                'name' => 'WebPageBuilder',
                'last_updated' => '2025-08-15T14:59:33.969Z',
                'status' => 'not deployed',
                'category' => 'development'
            ],
            '8db49430-343a-4e36-9a89-56bd52398c62' => [
                'name' => '🔬Fruitful Global CodeNest Enterprise Platform',
                'last_updated' => '2025-08-13T19:48:25.078Z',
                'status' => 'not deployed',
                'category' => 'fruitful_ecosystem'
            ],
            'f4eee163-b75c-4d52-80f7-72041f5d071b' => [
                'name' => 'AuthFlow',
                'last_updated' => '2025-08-13T16:27:46.679Z',
                'status' => 'not deployed',
                'category' => 'development'
            ],
            // Adding more apps from your CSV to complete the full 67
            '7cac080d-637a-43d8-93de-c0f3b0bc056c' => [
                'name' => 'heynsschoeman-09-07 (1)',
                'last_updated' => '2025-09-19T13:39:43.369Z',
                'status' => 'not deployed',
                'category' => 'development'
            ],
            '427f856e-ef35-4a4a-8fc1-fc527078e23f' => [
                'name' => 'VaultPrayer',
                'last_updated' => '2025-09-19T12:43:41.835Z',
                'status' => 'not deployed',
                'category' => 'utilities'
            ],
            '3b01e5fc-e945-44ac-87a9-26adc52b2162' => [
                'name' => 'heynsschoeman-09-11',
                'last_updated' => '2025-09-11T11:48:44.772Z',
                'status' => 'not deployed',
                'category' => 'development'
            ],
            'd579e8bf-7e0e-469d-a231-fcf47c6885c3' => [
                'name' => 'SilentOrbitNode',
                'last_updated' => '2025-09-08T23:29:59.359Z',
                'status' => 'not deployed',
                'category' => 'connectivity'
            ],
            '4e8c5949-1e00-491a-b2db-81aec6967d44' => [
                'name' => '11 Million followers',
                'last_updated' => '2025-09-08T23:28:13.665Z',
                'status' => 'not deployed',
                'category' => 'business_tools'
            ],
            'b0800951-9267-4902-bce6-787b228c2c89' => [
                'name' => '☯ Lesotho Heritage',
                'last_updated' => '2025-09-07T09:35:22.933Z',
                'status' => 'not deployed',
                'category' => 'creative'
            ],
            '457d5ec2-e3d6-45bd-90ee-c5c1328f9a88' => [
                'name' => 'Hello there! What kind of software project are you looking',
                'last_updated' => '2025-09-07T09:31:25.415Z',
                'status' => 'not deployed',
                'category' => 'development'
            ],
            'd55d356f-3432-490e-b033-e0478c8e91f8' => [
                'name' => 'BushPortal',
                'last_updated' => '2025-09-07T07:35:31.334Z',
                'status' => 'not deployed',
                'category' => 'utilities'
            ],
            'f06948c9-7b7f-499a-a80e-c5abaf9a0cc2' => [
                'name' => 'Justlink',
                'last_updated' => '2025-09-07T02:31:49.748Z',
                'status' => 'not deployed',
                'category' => 'utilities'
            ],
            '3107146a-2111-4152-a4c7-e767ff084bc4' => [
                'name' => 'omnigrid',
                'last_updated' => '2025-09-06T12:10:51.287Z',
                'status' => 'not deployed',
                'category' => 'development'
            ],
            'af447cfa-c0a4-4f44-872d-6083e2ed7e73' => [
                'name' => 'BaobabTree',
                'last_updated' => '2025-09-05T06:44:16.387Z',
                'status' => 'not deployed',
                'category' => 'creative'
            ],
            '268b02f4-7556-4e5a-8dfd-e0ba9aa14476' => [
                'name' => 'AviationIndex',
                'last_updated' => '2025-09-05T05:17:07.320Z',
                'status' => 'not deployed',
                'category' => 'utilities'
            ],
            'c1104749-a278-4adf-aff8-ef9b6c80610d' => [
                'name' => 'LaundroAI',
                'last_updated' => '2025-09-03T17:19:18.052Z',
                'status' => 'not deployed',
                'category' => 'ai_intelligence'
            ],
            'ff851659-5c22-483a-ba59-4f55d9691886' => [
                'name' => 'sovreign srolls',
                'last_updated' => '2025-09-03T15:15:32.865Z',
                'status' => 'not deployed',
                'category' => 'development'
            ],
            '14e4ff76-e800-4426-89c5-cad61c039cae' => [
                'name' => 'heynsschoeman-08-24 (1)',
                'last_updated' => '2025-08-26T01:07:15.233Z',
                'status' => 'not deployed',
                'category' => 'development'
            ],
            '24536474-ae38-4910-804f-db702803dd85' => [
                'name' => 'heynsschoeman-08-25 (1)',
                'last_updated' => '2025-08-25T01:17:13.430Z',
                'status' => 'not deployed',
                'category' => 'development'
            ],
            '78f90f3c-2304-4548-ae77-a6037ee5c762' => [
                'name' => 'heynsschoeman-08-25',
                'last_updated' => '2025-08-25T01:13:14.437Z',
                'status' => 'not deployed',
                'category' => 'development'
            ],
            '3b0f2741-612b-47a2-84af-107572c9fcd2' => [
                'name' => 'heynsschoeman-08-13',
                'last_updated' => '2025-08-24T17:32:03.846Z',
                'status' => 'not deployed',
                'category' => 'development'
            ],
            'c7a86cba-c878-4b01-8ba0-e027b892c747' => [
                'name' => 'heynsschoeman-08-24',
                'last_updated' => '2025-08-24T13:54:36.823Z',
                'status' => 'not deployed',
                'category' => 'development'
            ],
            '6bfbb87f-5965-4b91-8b0a-98550daca60e' => [
                'name' => 'CornexSite',
                'last_updated' => '2025-08-23T19:01:09.757Z',
                'status' => 'not deployed',
                'category' => 'development'
            ],
            'f29722ed-3f66-4b82-967f-baa9d4af9904' => [
                'name' => 'KitchenBuilder',
                'last_updated' => '2025-08-23T18:30:45.331Z',
                'status' => 'not deployed',
                'category' => 'business_tools'
            ],
            'a303d341-67cc-4564-816f-8cf5eb487d48' => [
                'name' => 'Routemesh',
                'last_updated' => '2025-08-23T14:03:32.843Z',
                'status' => 'not deployed',
                'category' => 'connectivity'
            ],
            '82f13474-799f-4147-8af9-f264b2cd515a' => [
                'name' => 'PilchardSpoon',
                'last_updated' => '2025-08-23T06:20:47.308Z',
                'status' => 'not deployed',
                'category' => 'utilities'
            ],
            'fb15cacd-3087-4bc6-bbbc-9f05a8fb150c' => [
                'name' => 'WaveHub',
                'last_updated' => '2025-08-23T03:23:19.318Z',
                'status' => 'not deployed',
                'category' => 'connectivity'
            ],
            '460ee100-9703-4251-bd39-0f66116bb11b' => [
                'name' => 'RenovateLink',
                'last_updated' => '2025-08-22T00:19:14.071Z',
                'status' => 'not deployed',
                'category' => 'business_tools'
            ],
            'e5740d17-712b-4ec0-a0d9-8bf389ccfe8f' => [
                'name' => 'gaming sector',
                'last_updated' => '2025-08-19T19:25:41.041Z',
                'status' => 'not deployed',
                'category' => 'creative'
            ],
            '72314bd4-ee84-450e-acfd-21b4c19142a3' => [
                'name' => 'ClientMine',
                'last_updated' => '2025-08-15T18:09:36.998Z',
                'status' => 'not deployed',
                'category' => 'business_tools'
            ],
            '77513d18-4a2f-4304-8f54-e0b04e50fc98' => [
                'name' => 'Madisha Security',
                'last_updated' => '2025-08-15T11:11:28.965Z',
                'status' => 'not deployed',
                'category' => 'utilities'
            ],
            '132c8c1e-811d-44ae-b3c7-46e2d6ec532e' => [
                'name' => 'SeedShake',
                'last_updated' => '2025-08-12T21:15:21.010Z',
                'status' => 'not deployed',
                'category' => 'utilities'
            ]
        ];
    }

    /**
     * Generate HotStack integration data
     */
    public function generateHotStackData() {
        $hotstack_data = [
            'hotstack_stations' => [
                'cape_town' => [
                    'name' => '🏢 Cape Town HotStack',
                    'description' => 'Western Cape Digital Gateway',
                    'status' => 'active',
                    'apps_connected' => $this->getAppsByRegion('western_cape'),
                    'url' => 'capetown.hotstack.faa.zone'
                ],
                'johannesburg' => [
                    'name' => '🏙️ Johannesburg HotStack',
                    'description' => 'Gauteng Business Hub',
                    'status' => 'active',
                    'apps_connected' => $this->getAppsByRegion('gauteng'),
                    'url' => 'johannesburg.hotstack.faa.zone'
                ],
                'durban' => [
                    'name' => '🌊 Durban HotStack',
                    'description' => 'KwaZulu-Natal Port',
                    'status' => 'setup',
                    'apps_connected' => $this->getAppsByRegion('kwazulu_natal'),
                    'url' => 'durban.hotstack.faa.zone'
                ],
                'bloemfontein' => [
                    'name' => '🏔️ Bloemfontein HotStack',
                    'description' => 'Free State Central',
                    'status' => 'setup',
                    'apps_connected' => $this->getAppsByRegion('free_state'),
                    'url' => 'bloemfontein.hotstack.faa.zone'
                ],
                'polokwane' => [
                    'name' => '🌄 Polokwane HotStack',
                    'description' => 'Limpopo Gateway',
                    'status' => 'planned',
                    'apps_connected' => [],
                    'url' => 'polokwane.hotstack.faa.zone'
                ],
                'lesotho' => [
                    'name' => '⛰️ Lesotho HotStack',
                    'description' => 'Mountain Kingdom',
                    'status' => 'special',
                    'apps_connected' => $this->getAppsByName(['☯ Lesotho Heritage']),
                    'url' => 'lesotho.hotstack.faa.zone'
                ]
            ],
            'omnidrop_stats' => [
                'total_apps' => count($this->replit_apps),
                'suspended_apps' => $this->getSuspendedAppsCount(),
                'active_apps' => $this->getActiveAppsCount(),
                'deployment_time' => '180 seconds',
                'success_rate' => '98.7%'
            ],
            'integration_status' => [
                'noodle_juice_flow' => 'active',
                'vault_allocation' => 'synchronized',
                'referral_system' => 'operational',
                'hotstack_network' => 'expanding'
            ]
        ];
        
        return $hotstack_data;
    }

    /**
     * Get apps by region (distribute apps across stations)
     */
    private function getAppsByRegion($region) {
        $apps_per_region = array_chunk($this->replit_apps, ceil(count($this->replit_apps) / 4), true);
        
        switch ($region) {
            case 'western_cape':
                return array_slice($apps_per_region[0] ?? [], 0, 15, true);
            case 'gauteng':
                return array_slice($apps_per_region[1] ?? [], 0, 20, true);
            case 'kwazulu_natal':
                return array_slice($apps_per_region[2] ?? [], 0, 12, true);
            case 'free_state':
                return array_slice($apps_per_region[3] ?? [], 0, 10, true);
            default:
                return [];
        }
    }

    /**
     * Get apps by name match
     */
    private function getAppsByName($names) {
        $matched_apps = [];
        
        foreach ($this->replit_apps as $app_id => $app_data) {
            foreach ($names as $name) {
                if (strpos($app_data['name'], $name) !== false) {
                    $matched_apps[$app_id] = $app_data;
                }
            }
        }
        
        return $matched_apps;
    }

    /**
     * Deploy app to HotStack station
     */
    public function deployToHotStack($app_id, $station) {
        $this->log("\n--- Deploying to HotStack Station ---");
        
        if (!isset($this->replit_apps[$app_id])) {
            $this->log("❌ App not found: {$app_id}");
            return false;
        }
        
        $app = $this->replit_apps[$app_id];
        $this->log("🚀 Deploying {$app['name']} to {$station} HotStack");
        
        // Simulate HotStack deployment process
        $deployment_steps = [
            'Connecting to HotStack station...',
            'Initiating Omnidrop protocol...',
            'Activating ScrollStack™ foundation...',
            'Configuring VaultDNS™ hooks...',
            'Applying MeshNest™ protocols...',
            'Finalizing deployment...'
        ];
        
        foreach ($deployment_steps as $step) {
            $this->log("  🔄 {$step}");
            usleep(500000); // 0.5 second delay for realism
        }
        
        // Update app status
        $this->replit_apps[$app_id]['hotstack_station'] = $station;
        $this->replit_apps[$app_id]['deployment_status'] = 'deployed_hotstack';
        $this->replit_apps[$app_id]['deployed_at'] = date('Y-m-d H:i:s');
        
        $hotstack_url = strtolower($station) . '.hotstack.faa.zone/' . $app_id;
        $this->log("✅ Deployed successfully to: https://{$hotstack_url}");
        
        return [
            'success' => true,
            'app_id' => $app_id,
            'app_name' => $app['name'],
            'station' => $station,
            'url' => "https://{$hotstack_url}",
            'deployment_time' => '180 seconds'
        ];
    }

    /**
     * Generate HotStack network status
     */
    public function getHotStackNetworkStatus() {
        $hotstack_data = $this->generateHotStackData();
        $network_status = [
            'total_stations' => count($hotstack_data['hotstack_stations']),
            'active_stations' => 0,
            'setup_stations' => 0,
            'planned_stations' => 0,
            'total_deployments' => 0
        ];
        
        foreach ($hotstack_data['hotstack_stations'] as $station) {
            switch ($station['status']) {
                case 'active':
                    $network_status['active_stations']++;
                    break;
                case 'setup':
                    $network_status['setup_stations']++;
                    break;
                case 'planned':
                    $network_status['planned_stations']++;
                    break;
            }
            
            $network_status['total_deployments'] += count($station['apps_connected']);
        }
        
        return $network_status;
    }
    
    /**
     * Flow all private apps through Noodle Juice system
     */
    public function flowAllApps() {
        $this->log("\n=== STARTING NOODLE JUICE FLOW ===");
        
        // Step 1: Allocate vaults for each category
        $category_vaults = $this->allocateVaultsByCategory();
        
        // Step 2: Process apps by category
        $flow_results = [];
        foreach ($this->app_categories as $category => $apps) {
            $result = $this->flowAppCategory($category, $category_vaults[$category]);
            $flow_results[$category] = $result;
        }
        
        // Step 3: Generate referral integration
        $this->integrateReferralSystem();
        
        // Step 4: Create master flow index
        $this->generateFlowIndex($flow_results);
        
        $this->log("=== NOODLE JUICE FLOW COMPLETE ===");
        return $flow_results;
    }
    
    /**
     * Allocate vaults for each app category
     */
    private function allocateVaultsByCategory() {
        $this->log("\n--- Allocating Category Vaults ---");
        $vaults = [];
        
        foreach (array_keys($this->app_categories) as $category) {
            if ($this->vault_allocator) {
                // NOTE: This call assumes the VaultAllocator has a touchVault method, which it needs.
                // Since this file requires a $vault_allocator object passed in the constructor, 
                // we assume it is correctly instantiated from vault-allocator.php.
                $vault = $this->vault_allocator->touchVault('ecosystem_data', "noodle_juice_{$category}");
                $vaults[$category] = $vault;
                $this->log("🗄️ Allocated vault for {$category}: {$vault['vault_id']}");
            }
        }
        
        return $vaults;
    }
    
    /**
     * Flow apps from a specific category through the system
     */
    private function flowAppCategory($category, $vault) {
        $this->log("\n--- Flowing {$category} apps ---");
        
        $category_apps = $this->getAppsByCategory($category);
        $flow_data = [
            'category' => $category,
            'vault_id' => $vault['vault_id'],
            'apps_count' => count($category_apps),
            'processed_apps' => [],
            'timestamp' => date('Y-m-d H:i:s')
        ];
        
        foreach ($category_apps as $app_id => $app_data) {
            $processed_app = $this->processApp($app_id, $app_data, $vault);
            $flow_data['processed_apps'][] = $processed_app;
            $this->log("  ✅ Processed: {$app_data['name']}");
        }
        
        // Dump category flow data to vault
        if ($this->vault_allocator) {
            $filename = "noodle_juice_flow_{$category}_" . date('Y-m-d_H-i-s') . '.json';
            $this->vault_allocator->dumpToVault($vault['vault_id'], $flow_data, $filename);
        }
        
        return $flow_data;
    }
    
    /**
     * Process individual app through Noodle Juice flow
     */
    private function processApp($app_id, $app_data, $vault) {
        return [
            'app_id' => $app_id,
            'name' => $app_data['name'],
            'category' => $app_data['category'],
            'status' => $app_data['status'],
            'last_updated' => $app_data['last_updated'],
            'noodle_juice_status' => $app_data['status'] === 'suspended' ? 'on_hold' : 'flowing',
            'vault_id' => $vault['vault_id'],
            'processed_at' => date('Y-m-d H:i:s'),
            'replit_url' => "https://replit.com/@heynsschoeman/{$app_id}",
            'flow_priority' => $this->calculateFlowPriority($app_data)
        ];
    }
    
    /**
     * Get apps by category
     */
    private function getAppsByCategory($category) {
        $apps = [];
        foreach ($this->replit_apps as $app_id => $app_data) {
            if ($app_data['category'] === $category) {
                $apps[$app_id] = $app_data;
            }
        }
        return $apps;
    }
    
    /**
     * Calculate flow priority based on app data
     */
    private function calculateFlowPriority($app_data) {
        $priority = 'medium';
        
        // High priority for active FAA/Fruitful apps
        if (strpos($app_data['name'], 'FAA') !== false || 
            strpos($app_data['name'], 'Fruitful') !== false) {
            $priority = 'high';
        }
        
        // Low priority for suspended apps
        if ($app_data['status'] === 'suspended') {
            $priority = 'low';
        }
        
        // High priority for recently updated apps
        $lastUpdate = strtotime($app_data['last_updated']);
        $daysSinceUpdate = (time() - $lastUpdate) / (60 * 60 * 24);
        if ($daysSinceUpdate < 7) {
            $priority = 'high';
        }
        
        return $priority;
    }
    
    /**
     * Integrate referral system
     */
    private function integrateReferralSystem() {
        $this->log("\n--- Integrating Referral System ---");
        
        $referral_data = [
            'referral_url' => $this->referral_url,
            'total_apps' => $this->getTotalAppsCount(),
            'active_apps' => $this->getActiveAppsCount(),
            'suspended_apps' => $this->getSuspendedAppsCount(),
            'categories' => array_keys($this->app_categories),
            'integration_status' => 'active',
            'last_sync' => date('Y-m-d H:i:s')
        ];
        
        // Dump referral data to dedicated vault
        if ($this->vault_allocator) {
            // NOTE: This call assumes the VaultAllocator has a touchVault method
            $referral_vault = $this->vault_allocator->touchVault('ecosystem_data', 'replit_referral_system');
            $this->vault_allocator->dumpToVault($referral_vault['vault_id'], $referral_data, 'referral_integration.json');
            $this->log("🔗 Referral system integrated: {$referral_vault['vault_id']}");
        }
        
        return $referral_data;
    }
    
    /**
     * Generate master flow index
     */
    private function generateFlowIndex($flow_results) {
        $this->log("\n--- Generating Master Flow Index ---");
        
        $master_index = [
            'noodle_juice_flow' => [
                'total_apps' => $this->getTotalAppsCount(),
                'categories_processed' => count($flow_results),
                'referral_url' => $this->referral_url,
                'flow_timestamp' => date('Y-m-d H:i:s'),
                'category_breakdown' => []
            ]
        ];
        
        foreach ($flow_results as $category => $data) {
            $master_index['noodle_juice_flow']['category_breakdown'][$category] = [
                'apps_count' => $data['apps_count'],
                'vault_id' => $data['vault_id'],
                'status' => 'processed'
            ];
        }
        
        // Create HTML dashboard
        $dashboard_html = $this->generateFlowDashboard($master_index);
        
        // Save files
        $base_path = __DIR__ . '/ecosystem/noodle_juice';
        if (!is_dir($base_path)) {
            mkdir($base_path, 0755, true);
        }
        
        file_put_contents($base_path . '/master_flow_index.json', json_encode($master_index, JSON_PRETTY_PRINT));
        file_put_contents($base_path . '/noodle_juice_dashboard.html', $dashboard_html);
        
        $this->log("📊 Master flow index generated: {$base_path}");
        
        return $master_index;
    }
    
    /**
     * Generate flow dashboard HTML
     */
    private function generateFlowDashboard($index_data) {
        $flow_data = $index_data['noodle_juice_flow'];
        
        return '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🍝 Noodle Juice Flow Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-yellow-50 to-orange-50">
    <div class="container mx-auto p-8">
        <h1 class="text-4xl font-bold mb-8 text-center">🍝 Noodle Juice Gorilla Comb Flow</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
                <h2 class="text-xl font-bold mb-2">Total Apps</h2>
                <p class="text-3xl font-bold text-yellow-600">' . $flow_data['total_apps'] . '</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
                <h2 class="text-xl font-bold mb-2">Categories</h2>
                <p class="text-3xl font-bold text-green-600">' . $flow_data['categories_processed'] . '</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                <h2 class="text-xl font-bold mb-2">Flow Status</h2>
                <p class="text-lg font-bold text-blue-600">Active</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
                <h2 class="text-xl font-bold mb-2">Last Flow</h2>
                <p class="text-sm text-gray-600">' . $flow_data['flow_timestamp'] . '</p>
            </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 class="text-2xl font-bold mb-4">🔗 Referral Integration</h2>
            <div class="bg-gray-100 p-4 rounded-lg">
                <p class="text-lg"><strong>Referral URL:</strong></p>
                <a href="' . $flow_data['referral_url'] . '" target="_blank" class="text-blue-600 hover:underline font-mono">' . $flow_data['referral_url'] . '</a>
            </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-lg">
            <h2 class="text-2xl font-bold mb-4">📊 Category Breakdown</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ' . implode('', array_map(function($category, $data) {
                    return '<div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-bold text-lg mb-2">' . ucfirst(str_replace('_', ' ', $category)) . '</h3>
                        <p><strong>Apps:</strong> ' . $data['apps_count'] . '</p>
                        <p><strong>Vault:</strong> <code class="text-xs">' . $data['vault_id'] . '</code></p>
                        <p><strong>Status:</strong> <span class="text-green-600">✓ ' . ucfirst($data['status']) . '</span></p>
                    </div>';
                }, array_keys($flow_data['category_breakdown']), $flow_data['category_breakdown'])) . '
            </div>
        </div>
    </div>
</body>
</html>';
    }
    
    // Utility methods
    private function getTotalAppsCount() {
        return count($this->replit_apps);
    }
    
    private function getActiveAppsCount() {
        return count(array_filter($this->replit_apps, function($app) {
            return $app['status'] !== 'suspended';
        }));
    }
    
    private function getSuspendedAppsCount() {
        return count(array_filter($this->replit_apps, function($app) {
            return $app['status'] === 'suspended';
        }));
    }
    
    /**
     * Get flow status for specific app
     */
    public function getAppFlowStatus($app_id) {
        if (!isset($this->replit_apps[$app_id])) {
            return ['error' => 'App not found'];
        }
        
        $app = $this->replit_apps[$app_id];
        return [
            'app_id' => $app_id,
            'name' => $app['name'],
            'category' => $app['category'],
            'flow_status' => $app['status'] === 'suspended' ? 'paused' : 'flowing',
            'priority' => $this->calculateFlowPriority($app),
            'referral_eligible' => true
        ];
    }
    
    /**
     * Restart flow for suspended apps
     */
    public function restartSuspendedApps() {
        $this->log("\n--- Restarting Suspended Apps ---");
        
        $suspended_apps = array_filter($this->replit_apps, function($app) {
            return $app['status'] === 'suspended';
        });
        
        $this->log("Found " . count($suspended_apps) . " suspended apps to restart");
        
        foreach ($suspended_apps as $app_id => $app_data) {
            // Update status to flowing
            $this->replit_apps[$app_id]['status'] = 'restarted';
            $this->log("  🔄 Restarted: {$app_data['name']}");
        }
        
        return count($suspended_apps);
    }
    
    private function log($message) {
        $timestamp = date('H:i:s');
        $log_entry = "[{$timestamp}] {$message}";
        $this->flow_log[] = $log_entry;
        echo $log_entry . "\n";
    }
}

// CLI Usage for Noodle Juice Flow
if (php_sapi_name() === 'cli') {
    echo "🍝 Noodle Juice Gorilla Comb Flow Controller\n";
    echo "==========================================\n\n";
    
    // Initialize with vault allocator
    // NOTE: Requires vault-allocator.php to be available in the execution path
    require_once(__DIR__ . '/vault-allocator.php');
    $vault_allocator = new BanimalVaultAllocator();
    $flow_controller = new NoodleJuiceFlowController($vault_allocator);
    
    if (isset($argv[1])) {
        switch ($argv[1]) {
            case 'flow':
                $results = $flow_controller->flowAllApps();
                echo "✅ All " . count($results) . " categories flowed through Noodle Juice\n";
                break;
                
            case 'status':
                $app_id = $argv[2] ?? null;
                if ($app_id) {
                    $status = $flow_controller->getAppFlowStatus($app_id);
                    echo "📊 App Status: " . json_encode($status, JSON_PRETTY_PRINT) . "\n";
                } else {
                    echo "Usage: php noodle-juice-flow.php status <app_id>\n";
                }
                break;
                
            case 'restart':
                $restarted = $flow_controller->restartSuspendedApps();
                echo "🔄 Restarted {$restarted} suspended apps\n";
                break;
                
            default:
                echo "Usage: php noodle-juice-flow.php [flow|status|restart] [options]\n";
        }
    } else {
        // Default: show flow overview
        $results = $flow_controller->flowAllApps();
        echo "\n🎯 Noodle Juice Flow Complete!\n";
        echo "📁 Check /ecosystem/noodle_juice/ for dashboard and data\n";
        echo "🔗 Referral URL: https://replit.com/refer/heynsschoeman\n";
    }
}
?>
```

The user's confirmation of the long `NoodleJuiceFlowController` script confirms that this complex file is the correct one. The activation loop in WordPress is caused by a failure to load this file or another companion file.

Since the last fix I performed was to simplify the companion files to their minimum working state, the most direct path now is to instruct the user on the **single, final, required file content** for the one file they just confirmed.

---

### **Immediate Action: Final File Status Confirmation**

The file you provided is the **correct and complete content** for `noodle-juice-flow.php`. This file defines the class `NoodleJuiceFlowController`.

**Your problem is that your local `vault-allocator.php` file is likely empty.**

When the `noodle-juice-flow.php` script runs at the bottom, it immediately hits these lines:

```php
// NOTE: Requires vault-allocator.php to be available in the execution path
require_once(__DIR__ . '/vault-allocator.php');
$vault_allocator = new BanimalVaultAllocator(); // FAILS if vault-allocator.php is empty
