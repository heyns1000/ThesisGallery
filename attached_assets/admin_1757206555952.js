// Admin dashboard functionality
class AdminDashboard {
    constructor() {
        this.initializeEventListeners();
        this.loadInitialData();
    }

    initializeEventListeners() {
        // Sync admin data button
        const syncDataBtn = document.getElementById('syncDataBtn');
        if (syncDataBtn) {
            syncDataBtn.addEventListener('click', () => this.syncAdminData());
        }

        // Create PayPal products button
        const createProductsBtn = document.getElementById('createProductsBtn');
        if (createProductsBtn) {
            createProductsBtn.addEventListener('click', () => this.createPayPalProducts());
        }

        // Create PayPal plans button
        const createPlansBtn = document.getElementById('createPlansBtn');
        if (createPlansBtn) {
            createPlansBtn.addEventListener('click', () => this.createPayPalPlans());
        }

        // Add brand form
        const addBrandForm = document.getElementById('addBrandForm');
        if (addBrandForm) {
            addBrandForm.addEventListener('submit', (e) => this.handleAddBrand(e));
        }

        // Auto-calculate annual fee based on monthly fee
        const monthlyFeeInput = document.getElementById('monthlyFee');
        const annualFeeInput = document.getElementById('annualFee');
        if (monthlyFeeInput && annualFeeInput) {
            monthlyFeeInput.addEventListener('input', (e) => {
                const monthlyFee = parseFloat(e.target.value);
                if (monthlyFee && !isNaN(monthlyFee)) {
                    // Calculate annual fee with 10% discount
                    const annualFee = (monthlyFee * 12 * 0.9).toFixed(2);
                    annualFeeInput.value = annualFee;
                }
            });
        }
    }

    loadInitialData() {
        // Load sectors for dropdown if exists
        if (document.getElementById('sectorSelect')) {
            this.loadSectors();
        }
    }

    async loadSectors() {
        try {
            const response = await fetch('/api/sectors');
            const data = await response.json();
            
            if (data.success) {
                const select = document.getElementById('sectorSelect');
                select.innerHTML = '<option value="">Select a sector...</option>';
                
                data.sectors.forEach(sector => {
                    const option = document.createElement('option');
                    option.value = sector.id;
                    option.textContent = `${sector.glyph} ${sector.name}`;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error loading sectors:', error);
            this.showAlert('Error loading sectors', 'danger');
        }
    }

    async syncAdminData() {
        const btn = document.getElementById('syncDataBtn');
        const originalText = btn.innerHTML;
        
        try {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Syncing...';
            
            const response = await fetch('/api/sync-admin-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showAlert('Admin data sync started successfully', 'success');
                // Refresh page after a delay to show updated data
                setTimeout(() => {
                    location.reload();
                }, 3000);
            } else {
                this.showAlert(`Error syncing data: ${data.message}`, 'danger');
            }
        } catch (error) {
            console.error('Error syncing admin data:', error);
            this.showAlert('Network error during sync', 'danger');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }

    async createPayPalProducts() {
        const btn = document.getElementById('createProductsBtn');
        const originalText = btn.innerHTML;
        
        // Confirm action
        if (!confirm('This will create PayPal products for all brands that don\'t have them. This may take several minutes. Continue?')) {
            return;
        }
        
        try {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating...';
            
            const response = await fetch('/api/create-products-bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showAlert(`Started creating PayPal products for ${data.brand_count} brands`, 'success');
                
                // Track job progress if job ID is provided
                if (data.job_id) {
                    this.trackJobProgress(data.job_id, data.task_id);
                }
            } else {
                this.showAlert(`Error creating products: ${data.message}`, 'danger');
            }
        } catch (error) {
            console.error('Error creating PayPal products:', error);
            this.showAlert('Network error during product creation', 'danger');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }

    async createPayPalPlans() {
        const btn = document.getElementById('createPlansBtn');
        const originalText = btn.innerHTML;
        
        // Confirm action
        if (!confirm('This will create PayPal billing plans for all products that don\'t have them. This may take several minutes. Continue?')) {
            return;
        }
        
        try {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating...';
            
            const response = await fetch('/api/create-plans-bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showAlert(`Started creating PayPal plans for ${data.product_count} products`, 'success');
                
                // Track job progress if job ID is provided
                if (data.job_id) {
                    this.trackJobProgress(data.job_id, data.task_id);
                }
            } else {
                this.showAlert(`Error creating plans: ${data.message}`, 'danger');
            }
        } catch (error) {
            console.error('Error creating PayPal plans:', error);
            this.showAlert('Network error during plan creation', 'danger');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }

    trackJobProgress(jobId, taskId) {
        // Use existing trackJob function if available, otherwise implement basic tracking
        if (typeof trackJob === 'function') {
            trackJob(jobId, taskId);
        } else {
            // Basic tracking implementation
            console.log(`Tracking job ${jobId} (task: ${taskId})`);
            
            // Poll for updates every 5 seconds
            const pollInterval = setInterval(async () => {
                try {
                    const response = await fetch(`/api/job-status/${jobId}`);
                    const data = await response.json();
                    
                    if (data.success) {
                        const job = data.job;
                        console.log(`Job progress: ${job.processed_items}/${job.total_items} (${job.status})`);
                        
                        // Stop polling if job is complete
                        if (['completed', 'failed'].includes(job.status)) {
                            clearInterval(pollInterval);
                            
                            if (job.status === 'completed') {
                                this.showAlert('Job completed successfully!', 'success');
                            } else {
                                this.showAlert('Job failed. Check the status page for details.', 'danger');
                            }
                            
                            // Refresh page to show updated stats
                            setTimeout(() => {
                                location.reload();
                            }, 2000);
                        }
                    }
                } catch (error) {
                    console.error('Error polling job status:', error);
                    clearInterval(pollInterval);
                }
            }, 5000);
        }
    }

    async handleAddBrand(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const brandData = {
            sector_id: formData.get('sector_id'),
            name: formData.get('name'),
            monthly_fee: parseFloat(formData.get('monthly_fee')) || null,
            annual_fee: parseFloat(formData.get('annual_fee')) || null,
            subnodes: formData.get('subnodes') ? formData.get('subnodes').split(',').map(s => s.trim()).filter(Boolean) : []
        };
        
        // Validation
        if (!brandData.sector_id || !brandData.name) {
            this.showAlert('Please fill in required fields: Sector and Brand Name', 'danger');
            return;
        }
        
        try {
            const response = await fetch('/api/add-brand', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(brandData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showAlert(`Brand "${data.brand.name}" created successfully`, 'success');
                
                // Reset form
                event.target.reset();
                
                // Close modal if it exists
                const modal = bootstrap.Modal.getInstance(document.getElementById('addBrandModal'));
                if (modal) {
                    modal.hide();
                }
                
                // Refresh page to show new brand
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } else {
                this.showAlert(`Error creating brand: ${data.message}`, 'danger');
            }
        } catch (error) {
            console.error('Error adding brand:', error);
            this.showAlert('Network error during brand creation', 'danger');
        }
    }

    showAlert(message, type = 'info') {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Insert at top of container
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
        }
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    // Utility method to format numbers
    formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }

    // Utility method to format currency
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    // Utility method to format date
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Real-time status updates
class StatusMonitor {
    constructor() {
        this.isMonitoring = false;
        this.interval = null;
        this.updateFrequency = 30000; // 30 seconds
    }

    start() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        this.interval = setInterval(() => {
            this.updateStats();
        }, this.updateFrequency);
        
        console.log('Status monitoring started');
    }

    stop() {
        if (!this.isMonitoring) return;
        
        this.isMonitoring = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        console.log('Status monitoring stopped');
    }

    async updateStats() {
        try {
            const response = await fetch('/api/stats');
            const data = await response.json();
            
            if (data.success) {
                this.updateDashboardElements(data.stats);
            }
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    updateDashboardElements(stats) {
        // Update stat cards if they exist
        const elements = {
            'total_sectors': stats.total_sectors,
            'total_brands': stats.total_brands,
            'paypal_products_total': stats.paypal_products?.total,
            'paypal_products_created': stats.paypal_products?.created,
            'paypal_plans_total': stats.paypal_plans?.total,
            'paypal_plans_created': stats.paypal_plans?.created
        };
        
        Object.entries(elements).forEach(([key, value]) => {
            const element = document.querySelector(`[data-stat="${key}"]`);
            if (element && value !== undefined) {
                element.textContent = value;
            }
        });
        
        // Update last updated timestamp
        const lastUpdatedElement = document.getElementById('lastUpdated');
        if (lastUpdatedElement) {
            lastUpdatedElement.textContent = new Date().toLocaleTimeString();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin dashboard
    window.adminDashboard = new AdminDashboard();
    
    // Initialize status monitor if on appropriate pages
    if (window.location.pathname.includes('status') || window.location.pathname === '/') {
        window.statusMonitor = new StatusMonitor();
        window.statusMonitor.start();
        
        // Stop monitoring when page is about to unload
        window.addEventListener('beforeunload', () => {
            window.statusMonitor.stop();
        });
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+R or Cmd+R for refresh (override default)
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            location.reload();
        }
        
        // Ctrl+S or Cmd+S for sync data
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            const syncBtn = document.getElementById('syncDataBtn');
            if (syncBtn && !syncBtn.disabled) {
                syncBtn.click();
            }
        }
    });
});

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    
    // Show user-friendly error message
    if (window.adminDashboard) {
        window.adminDashboard.showAlert('An unexpected error occurred. Please refresh the page.', 'danger');
    }
});

// Export for use in other scripts
window.AdminDashboard = AdminDashboard;
window.StatusMonitor = StatusMonitor;
