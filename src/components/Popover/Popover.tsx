import { useState, useId, ElementType } from 'react'
import { FloatingPortal, useFloating, arrow, shift, offset } from '@floating-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useRef } from 'react'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  as?: ElementType
  initialOpen?: boolean
}

const Popover = ({ children, renderPopover, className, as: Element = 'div', initialOpen }: Props) => {
  const [open, setOpen] = useState<boolean>(initialOpen || false)
  const arrowRef = useRef<HTMLElement>(null)

  const { x, y, strategy, reference, floating, middlewareData } = useFloating({
    middleware: [offset(6), shift(), arrow({ element: arrowRef })]
  })

  const showPopover = () => {
    setOpen(true)
  }

  const hidePopover = () => {
    setOpen(false)
  }

  // Mỗi khi popover nó chạy nó sẽ tạo ra 1 id mới
  const id = useId()
  return (
    <Element className={`${className}`} ref={reference} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
      {children}

      {/* Để muốn mỗi Popover sẽ có 1 id khác nhau */}
      <FloatingPortal id={id}>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={floating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.2 }}
            >
              <span
                ref={arrowRef}
                className='absolute z-30 translate-y-[-95%] border-[11px]  border-x-transparent border-t-transparent border-b-white'
                style={{
                  left: middlewareData.arrow?.x,
                  top: middlewareData.arrow?.y
                }}
              ></span>
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}

export default Popover
