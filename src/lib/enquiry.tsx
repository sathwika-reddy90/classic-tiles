import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { EnquiryDrawer } from '../components/layout/EnquiryDrawer'
import type { Product } from '../data/types'

interface EnquiryState {
  open: boolean
  product?: Product
}

const EnquiryContext = createContext<{ openEnquiry: (product?: Product) => void }>({ openEnquiry: () => {} })

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EnquiryState>({ open: false })
  const openEnquiry = useCallback((product?: Product) => setState({ open: true, product }), [])
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), [])
  const value = useMemo(() => ({ openEnquiry }), [openEnquiry])

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      <EnquiryDrawer open={state.open} product={state.product} onClose={close} />
    </EnquiryContext.Provider>
  )
}

export const useEnquiry = () => useContext(EnquiryContext)
