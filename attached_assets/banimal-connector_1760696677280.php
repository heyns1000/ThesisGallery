<?php
/*
Plugin Name: Banimal Ecosystem Connector
Description: Integrates Banimal with your WordPress ecosystem.
Version: 4.1.0
Author: Fruitful Global Mac
*/

// CRITICAL: Ensure this file is accessed only via WordPress.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define Constants for stability
define( 'BANIMAL_CONNECTOR_DIR', plugin_dir_path( __FILE__ ) );
define( 'BANIMAL_SLUG', 'banimal-connector-settings' );
define( 'BANIMAL_API_OPTION', 'banimal_xai_api_key' ); // New option key for x.ai API storage

// =========================================================
// CRITICAL FILE INCLUSIONS (The entire plugin logic is housed in these files)
// =========================================================
require_once BANIMAL_CONNECTOR_DIR . 'ecosystem-puller.php';
require_once BANIMAL_CONNECTOR_DIR . 'vault-allocator.php';
require_once BANIMAL_CONNECTOR_DIR . 'noodle-juice-flow.php';
require_once BANIMAL_CONNECTOR_DIR . 'fruitful-google-drive-connector.php'; 
require_once BANIMAL_CONNECTOR_DIR . 'fruitful-mac-database-puller.php'; 
require_once BANIMAL_CONNECTOR_DIR . 'deploy-banimal-updates.php'; 

// =========================================================
// 1. PLUGIN LIFECYCLE HOOKS
// =========================================================

/**
 * Runs upon plugin activation. Used for setting up initial options or DB tables.
 */
function banimal_activate() {
    // Set a placeholder or default for the critical x.ai API Key
    if ( false === get_option( BANIMAL_API_OPTION ) ) {
        add_option( BANIMAL_API_OPTION, '' );
    }
    
    // Initialize the custom table for Banimal data
    $allocator = new VaultAllocator();
    $allocator->create_custom_table();
    
    // Placeholder for Google Drive client options
    add_option( 'banimal_gdrive_auth_token', '' ); 
}
register_activation_hook( __FILE__, 'banimal_activate' );

/**
 * Runs upon plugin deactivation. Used for cleanup tasks.
 */
function banimal_deactivate() {
    // Placeholder: Clear scheduled wp_cron jobs related to Banimal sync
}
register_deactivation_hook( __FILE__, 'banimal_deactivate' );


// =========================================================
// 2. PHP PLUGIN CORE
// =========================================================

/**
 * Main Banimal Connector Class
 */
class BanimalConnector {
    public function __construct() {
        // Add Admin Menu Link
        add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );

        // Add client-side logic only on admin screens
        add_action('admin_enqueue_scripts', array( $this, 'enqueue_ant_lattice_system' ) );

        // Register Server-Side AJAX Handlers for authenticated users (Inbound Sync)
        add_action( 'wp_ajax_banimal_ecosystem_sync', array( $this, 'handle_ecosystem_sync' ) );
        
        // Register Server-Side AJAX Handlers for authenticated users (Outbound Deploy)
        add_action( 'wp_ajax_banimal_deploy_update', array( $this, 'handle_deploy_update' ) );
    }

    /**
     * Adds the Banimal settings page link to the WordPress admin menu.
     */
    public function add_admin_menu() {
        add_menu_page(
            'Banimal Settings',
            'Banimal Ecosystem',
            'manage_options',
            BANIMAL_SLUG,
            array( $this, 'settings_page_content' ),
            'dashicons-chart-area', // Use a relevant icon
            6
        );
    }

    /**
     * Placeholder for the Banimal Settings Page HTML content, including API input.
     */
    public function settings_page_content() {
        $api_key = get_option( BANIMAL_API_OPTION );
        echo '<div class="wrap">';
        echo '<h1>Banimal Ecosystem Configuration</h1>';
        echo '<p>This is the control panel for the Banimal Ecosystem Connector. The ANT_LATTICE heartbeat loop is running in your browser console.</p>';

        // Display x.ai API Key status
        echo '<h2>HOTSTACK & x.ai Configuration</h2>';
        echo '<p>The x.ai API key is critical for authorized data transfer and processing.</p>';
        echo '<form method="post" action="options.php">';
        settings_fields( BANIMAL_SLUG ); // Security nonce and hidden fields
        do_settings_sections( BANIMAL_SLUG ); // Output settings fields

        // Placeholder for the actual API Key field
        echo '<table class="form-table"><tr><th scope="row"><label for="' . BANIMAL_API_OPTION . '">x.ai API Key</label></th><td>';
        echo '<input type="text" id="' . BANIMAL_API_OPTION . '" name="' . BANIMAL_API_OPTION . '" value="' . esc_attr( $api_key ) . '" class="regular-text" placeholder="Enter your x.ai API Key here" />';
        echo '<p class="description">Required for integration with the HOTSTACK API and Cube Lattice validation.</p>';
        echo '</td></tr></table>';

        // --- Google Drive Authorization Status ---
        $gdrive_connector = new FruitfulGoogleDriveConnector();
        $gdrive_status = $gdrive_connector->is_authorized() ? 'Authorized' : 'Authorization Required';
        $gdrive_class = $gdrive_connector->is_authorized() ? 'text-green-600' : 'text-red-600';

        echo '<h2>Google Drive Connector Status</h2>';
        echo '<p>Status: <span class="' . $gdrive_class . ' font-bold">' . $gdrive_status . '</span></p>';
        // Placeholder button for Oauth flow
        echo '<button type="button" class="button button-secondary">Initiate Google Drive Authorization</button>';


        submit_button('Save Configuration');
        echo '</form>';
        
        // --- Deployment Section ---
        echo '<h2>Outbound Deployment</h2>';
        echo '<p>Use this button to manually push critical updates or deployment signals back to the Banimal Ecosystem.</p>';
        echo '<button type="button" id="banimal-deploy-btn" class="button button-primary button-large">⚡ Initiate Ecosystem Deployment</button>';

        echo '</div>';
    }
    
    // Register the API Key field in the WordPress Settings API
    public function register_settings() {
        register_setting( BANIMAL_SLUG, BANIMAL_API_OPTION );
    }

    /**
     * Server-side handler for the client-side ANT_LATTICE sync request (from AJAX).
     */
    public function handle_ecosystem_sync() {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( 'Permission denied.' );
        }
        
        $status = $this->run_ecosystem_pull();

        if ( is_wp_error( $status ) ) {
             wp_send_json_error( array( 'message' => 'Ecosystem sync failed.', 'details' => $status->get_error_message(), 'records' => $status->get_error_data()['records'] ?? 0 ) );
        } else {
             wp_send_json_success( array( 'message' => 'Ecosystem sync complete.', 'records_updated' => $status['records'] ) );
        }
    }
    
    /**
     * Server-side handler for the client-side Deployment request (from AJAX).
     */
    public function handle_deploy_update() {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( 'Permission denied.' );
        }

        $status = $this->run_deployment();
        
        if ( is_wp_error( $status ) ) {
             wp_send_json_error( array( 'message' => 'Ecosystem deployment failed.', 'details' => $status->get_error_message() ) );
        } else {
             wp_send_json_success( array( 'message' => 'Ecosystem deployment successful.', 'deployment_id' => $status['id'] ) );
        }
    }

    /**
     * Core logic to pull data from the Banimal API and push to HOTSTACK.
     */
    private function run_ecosystem_pull() {
        $xai_api_key = get_option( BANIMAL_API_OPTION );
        $total_records = 0;
        
        if ( empty( $xai_api_key ) ) {
            return new WP_Error( 'missing_api', 'The x.ai API Key is required for Banimal connection.' );
        }
        
        // --- STEP 0: COLLECT AUXILIARY DATA SOURCES ---
        $aux_data = array();
        
        // Google Drive Connector Integration
        $gdrive_connector = new FruitfulGoogleDriveConnector();
        $gdrive_files = $gdrive_connector->index_drive_files();
        if ( !is_wp_error( $gdrive_files ) ) {
            $aux_data['google_drive_manifest'] = $gdrive_files;
            $total_records += count($gdrive_files);
        }
        
        // Mac Database Puller Integration
        $mac_data_puller = new FruitfulMacDatabasePuller();
        $mac_data = $mac_data_puller->fetch_local_data();
        if ( !is_wp_error( $mac_data ) ) {
            $aux_data['mac_local_manifest'] = $mac_data;
            $total_records += count($mac_data);
        }
        
        // --- STEP 1: PULL CORE MANIFEST DATA (EcosystemPuller) ---
        $puller = new EcosystemPuller( $xai_api_key );
        $manifest = $puller->fetch_ecosystem_manifest();

        if ( is_wp_error( $manifest ) ) {
            return new WP_Error( 'pull_error', 'Ecosystem manifest pull failed: ' . $manifest->get_error_message(), array('records' => $total_records) );
        }

        // Merge Core Manifest with Auxiliary Data
        $manifest = array_merge_recursive($manifest, $aux_data);
        $total_records += (isset($manifest['sectors']) ? count($manifest['sectors']) : 0);
        
        // --- STEP 2: PROCESS DATA (NoodleJuiceFlow Integration) ---
        $juice_processor = new NoodleJuiceFlow();
        $processed_result = $juice_processor->process_juice( $manifest );

        if ( $processed_result['status'] === 'empty' ) {
            return array( 'records' => 0 );
        }

        $processed_data = $processed_result['data'];
        
        // --- STEP 3: ALLOCATE & PUSH (VaultAllocator Integration) ---
        $allocator = new VaultAllocator();
        $records_count = $allocator->allocate_data( $processed_data );
        
        // --- STEP 4: HOTSTACK PUSH (Deployment for immediate consumption) ---
        $hotstack_url = 'https://hotstack.faa.zone/api/intake';

        $response = wp_remote_post( $hotstack_url, array(
            'method'    => 'POST',
            'timeout'   => 45, 
            'headers'   => array( 
                'Content-Type' => 'application/json',
                'X-Banimal-Auth' => $xai_api_key
            ),
            'body'      => json_encode( $processed_data ),
            'data_format' => 'body',
        ) );
        
        if ( is_wp_error( $response ) ) {
            return new WP_Error( 'hotstack_warning', 'Local sync successful, but HOTSTACK push failed: ' . $response->get_error_message(), array('records' => $records_count) );
        }
        
        $response_code = wp_remote_retrieve_response_code( $response );
        if ( $response_code !== 200 && $response_code !== 201 ) {
            $body = wp_remote_retrieve_body( $response );
            return new WP_Error( 'hotstack_warning', 'Local sync successful, but HOTSTACK returned status ' . $response_code . ': ' . $body, array('records' => $records_count) );
        }
        
        // Successful manifest pull, processing, local allocation, and HOTSTACK push
        return array( 'records' => $records_count ); 
    }
    
    /**
     * Executes the outbound deployment logic.
     */
    private function run_deployment() {
        $xai_api_key = get_option( BANIMAL_API_OPTION );

        if ( empty( $xai_api_key ) ) {
            return new WP_Error( 'missing_api', 'The x.ai API Key is required to run the deployment.' );
        }

        $deployer = new DeployBanimalUpdates($xai_api_key);
        $result = $deployer->send_deployment_signal();

        if (is_wp_error($result)) {
            return $result;
        }

        // Deployment successful, returning the deployment ID
        return $result;
    }


    // =========================================================
    // 3. CLIENT-SIDE JAVASCRIPT LOGIC ENQUEUE (ANT_LATTICE System)
    // =========================================================

    /**
     * Enqueues the AntsVaultMeshLevel7System JavaScript class and localization data.
     */
    public function enqueue_ant_lattice_system() {
        // Get the current screen object
        $current_screen = get_current_screen();

        // Check if we are on the Banimal settings page before loading the JS
        if ( $current_screen && $current_screen->id === 'toplevel_page_' . BANIMAL_SLUG ) {

            // 1. Register a handle for the client-side lattice script
            wp_register_script('banimal-lattice-js', '', [], '4.1.0', true);
            wp_enqueue_script('banimal-lattice-js');
            
            // NOTE: Must also load required scripts for WordPress Settings API
            add_action( 'admin_init', array( $this, 'register_settings' ) );

            // 2. Localize script with necessary data for AJAX calls
            wp_localize_script( 'banimal-lattice-js', 'banimal_ajax_data', array(
                'ajax_url' => admin_url( 'admin-ajax.php' ),
                'sync_action' => 'banimal_ecosystem_sync',
                'deploy_action' => 'banimal_deploy_update', // New action for deployment
                'security_nonce' => wp_create_nonce( 'banimal-sync-nonce' ), 
            ));

            // 3. Define the JavaScript content (AntsVaultMeshLevel7System)
            $js_code = "
                class AntsVaultMeshLevel7System {
                    constructor() {
                        this.vaultMeshLevel = 7;
                        this.refreshCycle = 120; // seconds
                        this.isActive = false;
                        this.nodes = {};
                        this.globalLoopInterval = null;
                        this.ajaxData = window.banimal_ajax_data; // Localized data for AJAX calls

                        // Core configuration properties
                        this.author = 'fruitful-global-mac';
                        this.lunoWalkDirection = 'backwards';
                        this.memoryResetInterval = 0.84; // seconds
                        this.antAtmosphereTime = true;
                        this.pressureFreeNavigation = true;
                        this.banimalLoopSync = true;
                        this.payrollosUpdateInterval = 9;
                        this.notificationsAvailable = false;
                        this.vibrationDetection = 'every-single-one';

                        // Auto-start loop when the system is initialized on the admin page
                        this.startGlobalLoop();
                        this.setupDeploymentListener(); // Setup listener on load
                    }
                    
                    // Setup the button listener for manual deployment
                    setupDeploymentListener() {
                        const deployBtn = document.getElementById('banimal-deploy-btn');
                        if (deployBtn) {
                            deployBtn.addEventListener('click', () => {
                                this.triggerDeployment(deployBtn);
                            });
                        }
                    }

                    // Method to start the main sync loop
                    startGlobalLoop() {
                        if (this.isActive) return;
                        this.isActive = true;
                        this.globalLoopInterval = setInterval(() => {
                            this.triggerServerSync();
                        }, this.refreshCycle * 1000);
                        this.log('🚀 ANT_LATTICE global loop STARTED (Cycle: ' + this.refreshCycle + 's)');
                    }
                    
                    // New method to call the WordPress AJAX endpoint for PULL/SYNC
                    triggerServerSync() {
                        this.log('Heartbeat: Firing server sync logic via AJAX...');
                        
                        const formData = new FormData();
                        formData.append('action', this.ajaxData.sync_action);
                        formData.append('security', this.ajaxData.security_nonce);
                        
                        fetch(this.ajaxData.ajax_url, {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                this.log('✅ Server Sync Success: ' + data.data.message + ' (Records: ' + data.data.records_updated + ')');
                            } else {
                                const records = data.data.records || 'N/A'; 
                                this.log('❌ Server Sync Failed: ' + data.data.message + ' (Processed: ' + records + ')');
                            }
                        })
                        .catch(error => {
                            this.log('🚨 AJAX Sync Error: ' + error.message);
                        });
                    }
                    
                    // New method to call the WordPress AJAX endpoint for DEPLOYMENT
                    triggerDeployment(buttonElement) {
                        this.log('Deployment: Sending outbound signal via AJAX...');
                        
                        const originalText = buttonElement.textContent;
                        buttonElement.textContent = 'Deploying... Please wait.';
                        buttonElement.disabled = true;

                        const formData = new FormData();
                        formData.append('action', this.ajaxData.deploy_action); // Use the new deploy action
                        formData.append('security', this.ajaxData.security_nonce);
                        
                        fetch(this.ajaxData.ajax_url, {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                this.log('🟢 DEPLOYMENT SUCCESS: ID ' + data.data.deployment_id);
                                buttonElement.textContent = 'Deployment Successful!';
                            } else {
                                this.log('🔴 DEPLOYMENT FAILED: ' + data.data.message);
                                buttonElement.textContent = 'Deployment Failed. Check Console.';
                            }
                        })
                        .catch(error => {
                            this.log('🚨 AJAX Deploy Error: ' + error.message);
                            buttonElement.textContent = 'Deployment Error.';
                        })
                        .finally(() => {
                            setTimeout(() => {
                                buttonElement.textContent = originalText;
                                buttonElement.disabled = false;
                            }, 5000); // Re-enable button after 5 seconds
                        });
                    }
                    // ... (rest of the JS methods)

                    // Method to inject data into a node
                    injectData(nodeId, data) {
                        const node = this.nodes[nodeId];
                        if (node) {
                            node.data = { ...node.data, ...data };
                            this.log(`📥 Data injected into \${nodeId}`);
                        }
                    }

                    // Method to modify refresh rate
                    updateRefreshRate(newRate) {
                        if (this.globalLoopInterval) {
                            clearInterval(this.globalLoopInterval);
                        }
                        this.refreshCycle = newRate;
                        this.startGlobalLoop();
                        this.log(`🔄 ANT_LATTICE refresh rate updated to \${newRate}s`);
                    }

                    // Method to stop the lattice
                    stopAntLattice() {
                        if (this.globalLoopInterval) {
                            clearInterval(this.globalLoopInterval);
                            this.isActive = false;
                            this.log('🛑 ANT_LATTICE global loop STOPPED');
                        }
                    }

                    // Method for logging to the browser console
                    log(message) {
                        console.log(`[ANT_LATTICE] \${message}`);

                        // Integrate with existing ecosystem logging functions if available
                        if (window.ecosystemAdmin) {
                            window.ecosystemAdmin.log(`🐜 \${message}`);
                        }
                    }
                }

                // Initialize the ANT_LATTICE system globally
                const antsVaultMeshLevel7 = new AntsVaultMeshLevel7System();
                window.antsVaultMeshLevel7 = antsVaultMeshLevel7;

                // Global error handler for client-side errors
                window.addEventListener('error', function(event) {
                    console.error('Global Error Caught:', event);
                    antsVaultMeshLevel7.log(`Global Error: \${event.message} at \${event.filename}:\${event.lineno}`);
                });
            ";

            // 4. Add the JS code inline to the registered script
            wp_add_inline_script('banimal-lattice-js', $js_code);
        }
    }
}

// Initialize the plugin instance
$banimal_connector = new BanimalConnector();
