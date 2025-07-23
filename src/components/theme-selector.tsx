"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Check, ChevronDown, Palette } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useThemeLoader, type ThemeConfig } from "@/lib/theme-loader"

export function ThemeSelector() {
  const { loadTheme, getCurrentTheme, getAvailableThemes } = useThemeLoader()
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(getCurrentTheme())
  const [isLoading, setIsLoading] = useState(false)
  const availableThemes = getAvailableThemes()

  // Listen for theme changes from other sources
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      setCurrentTheme(event.detail.theme)
    }

    window.addEventListener('themeChanged', handleThemeChange as EventListener)
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange as EventListener)
    }
  }, [])

  const handleThemeSelect = async (themeId: string) => {
    if (themeId === currentTheme.id || isLoading) return

    setIsLoading(true)
    try {
      await loadTheme(themeId)
      setCurrentTheme(getCurrentTheme())
    } catch (error) {
      console.error('Failed to switch theme:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 px-3"
          disabled={isLoading}
          type="button"
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline-block">{currentTheme.name}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {availableThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => handleThemeSelect(theme.id)}
            className={cn(
              "flex items-center justify-between cursor-pointer",
              theme.id === currentTheme.id && "bg-accent"
            )}
          >
            <div className="flex flex-col items-start">
              <span className="font-medium">{theme.name}</span>
              <span className="text-xs text-muted-foreground">
                {theme.description}
              </span>
            </div>
            {theme.id === currentTheme.id && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}