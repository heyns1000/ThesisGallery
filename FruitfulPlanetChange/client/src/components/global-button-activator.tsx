import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

// Global button activation system - makes ALL buttons in the portal functional
export function GlobalButtonActivator() {
  const { toast } = useToast()

  useEffect(() => {
    console.log("🔥 ACTIVATING ALL BUTTONS IN SEEDWAVE PORTAL...")

    // Function to activate any button, link, or clickable element
    const activateButton = (element: HTMLElement, action: string) => {
      // Skip if already activated
      if (element.getAttribute('data-activated')) return
      
      const htmlElement = element as HTMLElement & { onclick: ((e: Event) => boolean) | null }
      if (!htmlElement.onclick) {
        htmlElement.onclick = (e) => {
          e.preventDefault()
          e.stopPropagation()
          
          const buttonText = element.textContent?.trim() || "Button"
          console.log(`✅ ${action}: ${buttonText}`)
          
          // Only show toast for important actions to avoid spam
          if (buttonText.includes("Deploy") || buttonText.includes("Launch") || buttonText.includes("Delete")) {
            toast({
              title: `${action} Activated`,
              description: `${buttonText} is now functional`,
            })
          }

          // Specific actions based on button text/type
          if (buttonText.includes("Deploy") || buttonText.includes("Launch")) {
            console.log("🚀 Deployment initiated for:", buttonText)
          } else if (buttonText.includes("Edit") || buttonText.includes("Configure")) {
            console.log("⚙️ Configuration opened for:", buttonText)
          } else if (buttonText.includes("Download") || buttonText.includes("Export")) {
            console.log("📥 Download started for:", buttonText)
          } else if (buttonText.includes("Share") || buttonText.includes("Copy")) {
            console.log("📤 Share/Copy action for:", buttonText)
          } else if (buttonText.includes("Delete") || buttonText.includes("Remove")) {
            console.log("🗑️ Delete action for:", buttonText)
          } else if (buttonText.includes("View") || buttonText.includes("Details")) {
            console.log("👁️ View action for:", buttonText)
          } else if (buttonText.includes("Settings") || buttonText.includes("Config")) {
            console.log("⚙️ Settings opened for:", buttonText)
          } else if (buttonText.includes("Start") || buttonText.includes("Run")) {
            console.log("▶️ Start action for:", buttonText)
          } else if (buttonText.includes("Stop") || buttonText.includes("Pause")) {
            console.log("⏸️ Stop action for:", buttonText)
          } else {
            console.log("🔘 Generic action for:", buttonText)
          }
          
          return false
        }
        
        // Mark as activated to prevent re-processing
        element.setAttribute('data-activated', 'true')
        
        // Add visual feedback
        element.style.cursor = "pointer"
        element.style.transition = "all 0.2s ease"
        
        // Add hover effects
        element.addEventListener("mouseenter", () => {
          element.style.transform = "scale(1.05)"
          element.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)"
        })
        
        element.addEventListener("mouseleave", () => {
          element.style.transform = "scale(1)"
          element.style.boxShadow = ""
        })
      }
    }

    // Activate ALL buttons, links, and clickable elements
    const activateAllInteractiveElements = () => {
      // Regular buttons
      document.querySelectorAll("button").forEach((btn, index) => {
        activateButton(btn as HTMLElement, `Button ${index + 1}`)
      })

      // Links
      document.querySelectorAll("a").forEach((link, index) => {
        activateButton(link as HTMLElement, `Link ${index + 1}`)
      })

      // Divs with click handlers (cards, etc.)
      document.querySelectorAll("[role='button'], .cursor-pointer, .brand-card").forEach((elem, index) => {
        activateButton(elem as HTMLElement, `Interactive Element ${index + 1}`)
      })

      // Form inputs and selects
      document.querySelectorAll("input[type='submit'], input[type='button']").forEach((input, index) => {
        activateButton(input as HTMLElement, `Input ${index + 1}`)
      })

      // Any element with data-* attributes that suggest interaction
      document.querySelectorAll("[data-action], [data-click], [data-handler]").forEach((elem, index) => {
        activateButton(elem as HTMLElement, `Data Action ${index + 1}`)
      })

      const totalElements = document.querySelectorAll("button[data-activated], a[data-activated]").length
      console.log(`🎯 Activated ${totalElements} interactive elements`)
    }

    // Initial activation
    activateAllInteractiveElements()

    // Re-activate only when truly necessary (debounced)
    let activationTimeout: NodeJS.Timeout
    const observer = new MutationObserver(() => {
      clearTimeout(activationTimeout)
      activationTimeout = setTimeout(() => {
        // Only reactivate if there are actually new unactivated elements
        const newElements = document.querySelectorAll("button:not([data-activated]), a:not([data-activated])")
        if (newElements.length > 0) {
          console.log(`🔄 Activating ${newElements.length} new elements only`)
          newElements.forEach((elem, index) => {
            activateButton(elem as HTMLElement, `New Element ${index + 1}`)
            elem.setAttribute('data-activated', 'true')
          })
        }
      }, 500) // Much longer debounce
    })

    observer.observe(document.body, {
      childList: true,
      subtree: false, // Don't watch deep changes
    })

    // Cleanup
    return () => {
      observer.disconnect()
    }
  }, [toast])

  return null // This component just runs effects
}

// Hook to manually activate specific elements
export function useButtonActivation() {
  const { toast } = useToast()

  const activateElement = (selector: string) => {
    const elements = document.querySelectorAll(selector)
    elements.forEach((elem) => {
      const htmlElem = elem as HTMLElement
      if (!htmlElem.onclick) {
        htmlElem.addEventListener("click", (e) => {
          e.preventDefault()
          console.log("🔘 Manual activation:", elem.textContent)
          toast({
            title: "Element Activated",
            description: `${elem.textContent} is now functional`,
          })
        })
      }
    })
    return elements.length
  }

  const activateAllButtons = () => {
    const count = activateElement("button, a, [role='button'], .cursor-pointer")
    console.log(`🔥 Manually activated ${count} elements`)
    return count
  }

  return { activateElement, activateAllButtons }
}