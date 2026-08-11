'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const ACTIVATE_PX = 4;

function isEditableTarget(target) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      'input, textarea, select, [contenteditable="true"], [role="textbox"]'
    )
  );
}

function isPanSurface(target) {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest('[data-board-pan-handle]'));
}

function isCardOrControl(target) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      '[data-slot="kanban-item"], [data-slot="kanban-column-handle"], button, a, [role="button"]'
    )
  );
}

/**
 * Drag-to-pan a horizontal scroller.
 * Preferred: drag the strip / empty area marked with data-board-pan-handle.
 */
export function useBoardPan() {
  const scrollerRef = useRef(null);
  const spaceHeldRef = useRef(false);
  const dragRef = useRef({
    active: false,
    pending: false,
    startX: 0,
    startScrollLeft: 0
  });
  const [isPanning, setIsPanning] = useState(false);
  const [isPanReady, setIsPanReady] = useState(false);
  const [scrollerNode, setScrollerNode] = useState(null);

  const panRef = useCallback((node) => {
    scrollerRef.current = node;
    setScrollerNode(node);
  }, []);

  useEffect(() => {
    const el = scrollerNode;
    if (!el) return;

    function setDragging(next) {
      dragRef.current.active = next;
      setIsPanning(next);
      el.dataset.panning = next ? 'true' : 'false';
      document.body.style.cursor = next ? 'grabbing' : '';
      document.body.style.userSelect = next ? 'none' : '';
    }

    function stopDrag() {
      dragRef.current.pending = false;
      if (!dragRef.current.active) return;
      setDragging(false);
    }

    function startPan(event, immediate) {
      dragRef.current = {
        active: immediate,
        pending: !immediate,
        startX: event.pageX,
        startScrollLeft: el.scrollLeft
      };

      if (immediate) {
        event.preventDefault();
        event.stopPropagation();
        setDragging(true);
      }
    }

    function onKeyDown(event) {
      if (event.code !== 'Space' || event.repeat) return;
      if (isEditableTarget(event.target)) return;
      spaceHeldRef.current = true;
      setIsPanReady(true);
      event.preventDefault();
    }

    function onKeyUp(event) {
      if (event.code !== 'Space') return;
      spaceHeldRef.current = false;
      setIsPanReady(false);
    }

    function onMouseDown(event) {
      if (isEditableTarget(event.target)) return;

      const middle = event.button === 1;
      const left = event.button === 0;
      if (!middle && !left) return;

      // Dedicated pan surface under the board — always pan
      if (left && isPanSurface(event.target)) {
        startPan(event, true);
        return;
      }

      if (middle || spaceHeldRef.current) {
        startPan(event, true);
        return;
      }

      if (left && isCardOrControl(event.target)) return;

      // Other empty chrome — pan after a tiny move
      if (left) startPan(event, false);
    }

    function onMouseMove(event) {
      const drag = dragRef.current;

      if (drag.pending && !drag.active) {
        const dx = event.pageX - drag.startX;
        if (Math.abs(dx) < ACTIVATE_PX) return;
        drag.pending = false;
        drag.active = true;
        setDragging(true);
      }

      if (!drag.active) return;

      event.preventDefault();
      const walk = event.pageX - drag.startX;
      el.scrollLeft = drag.startScrollLeft - walk;
    }

    function onMouseUp() {
      stopDrag();
    }

    // Vertical wheel scrolls the page; never pan the board via wheel.
    // Block shift+wheel / horizontal trackpad so only drag/Space/middle-click pan.
    function onWheel(event) {
      if (el.scrollWidth <= el.clientWidth + 1) return;
      if (event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
        event.preventDefault();
      }
    }

    function onAuxClick(event) {
      if (event.button === 1) event.preventDefault();
    }

    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);
    el.addEventListener('mousedown', onMouseDown, true);
    window.addEventListener('mousemove', onMouseMove, true);
    window.addEventListener('mouseup', onMouseUp, true);
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('auxclick', onAuxClick);

    return () => {
      stopDrag();
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
      el.removeEventListener('mousedown', onMouseDown, true);
      window.removeEventListener('mousemove', onMouseMove, true);
      window.removeEventListener('mouseup', onMouseUp, true);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('auxclick', onAuxClick);
    };
  }, [scrollerNode]);

  return {
    panRef,
    isPanning,
    isPanReady
  };
}
