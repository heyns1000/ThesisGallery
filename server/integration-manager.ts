// Integration Manager for Seedwave™ Portal - VaultMesh™ powered ecosystem
import { getAPIConfig } from "../../shared/api-config"

export class IntegrationManager {
  private config = getAPIConfig()

  // PayPal Integration Service
  async initializePayPal() {
    if (!this.config.paypal.clientId || !this.config.paypal.clientSecret) {
      throw new Error('PayPal credentials not configured')
    }
    
    return {
      clientId: this.config.paypal.clientId,
      environment: this.config.paypal.environment,
      currency: this.config.paypal.currency
    }
  }

  // Firebase Integration Service
  async initializeFirebase() {
    if (!this.config.firebase.apiKey || !this.config.firebase.projectId) {
      throw new Error('Firebase credentials not configured')
    }
    
    return {
      ...this.config.firebase
    }
  }

  // Spotify Integration Service
  async initializeSpotify() {
    if (!this.config.spotify.clientId || !this.config.spotify.clientSecret) {
      throw new Error('Spotify credentials not configured')
    }
    
    return {
      clientId: this.config.spotify.clientId,
      redirectUri: this.config.spotify.redirectUri,
      scopes: ['user-read-private', 'user-read-email', 'playlist-read-private']
    }
  }

  // Xero Integration Service
  async initializeXero() {
    if (!this.config.xero.clientId || !this.config.xero.clientSecret) {
      throw new Error('Xero credentials not configured')
    }
    
    return {
      clientId: this.config.xero.clientId,
      redirectUri: this.config.xero.redirectUri,
      scopes: this.config.xero.scopes
    }
  }

  // Health Check for all services
  async getServicesHealth() {
    const services = []
    
    try {
      await this.initializePayPal()
      services.push({ 
        name: 'PayPal', 
        status: 'operational', 
        lastChecked: new Date().toISOString(),
        type: 'payment'
      })
    } catch (error) {
      services.push({ 
        name: 'PayPal', 
        status: 'configuration_needed', 
        error: error instanceof Error ? error.message : 'Configuration error',
        lastChecked: new Date().toISOString(),
        type: 'payment'
      })
    }

    try {
      await this.initializeFirebase()
      services.push({ 
        name: 'Firebase', 
        status: 'operational', 
        lastChecked: new Date().toISOString(),
        type: 'auth'
      })
    } catch (error) {
      services.push({ 
        name: 'Firebase', 
        status: 'configuration_needed', 
        error: error instanceof Error ? error.message : 'Configuration error',
        lastChecked: new Date().toISOString(),
        type: 'auth'
      })
    }

    try {
      await this.initializeSpotify()
      services.push({ 
        name: 'Spotify', 
        status: 'operational', 
        lastChecked: new Date().toISOString(),
        type: 'music'
      })
    } catch (error) {
      services.push({ 
        name: 'Spotify', 
        status: 'configuration_needed', 
        error: error instanceof Error ? error.message : 'Configuration error',
        lastChecked: new Date().toISOString(),
        type: 'music'
      })
    }

    try {
      await this.initializeXero()
      services.push({ 
        name: 'Xero', 
        status: 'operational', 
        lastChecked: new Date().toISOString(),
        type: 'accounting'
      })
    } catch (error) {
      services.push({ 
        name: 'Xero', 
        status: 'configuration_needed', 
        error: error instanceof Error ? error.message : 'Configuration error',
        lastChecked: new Date().toISOString(),
        type: 'accounting'
      })
    }

    return services
  }

  // Get OAuth URLs for services
  getOAuthUrls() {
    return {
      spotify: `https://accounts.spotify.com/authorize?response_type=code&client_id=${this.config.spotify.clientId}&scope=user-read-private%20user-read-email%20playlist-read-private&redirect_uri=${encodeURIComponent(this.config.spotify.redirectUri)}`,
      xero: `https://login.xero.com/identity/connect/authorize?response_type=code&client_id=${this.config.xero.clientId}&redirect_uri=${encodeURIComponent(this.config.xero.redirectUri)}&scope=${this.config.xero.scopes.join('%20')}`
    }
  }
}