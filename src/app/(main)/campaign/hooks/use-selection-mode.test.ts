import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSelectionMode } from "./use-selection-mode";

describe("useSelectionMode", () => {
  it("starts inactive with empty selection", () => {
    const { result } = renderHook(() => useSelectionMode());
    expect(result.current.isSelecting).toBe(false);
    expect(result.current.selectedIds.size).toBe(0);
  });

  it("toggle() flips selection mode", () => {
    const { result } = renderHook(() => useSelectionMode());
    act(() => result.current.toggle());
    expect(result.current.isSelecting).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.isSelecting).toBe(false);
  });

  it("toggle() clears previously selected ids", () => {
    const { result } = renderHook(() => useSelectionMode());
    act(() => {
      result.current.toggle();
      result.current.toggleId(1);
      result.current.toggleId(2);
    });
    expect(result.current.selectedIds.size).toBe(2);

    act(() => result.current.toggle());
    expect(result.current.selectedIds.size).toBe(0);
  });

  it("exit() turns selection off and clears ids", () => {
    const { result } = renderHook(() => useSelectionMode());
    act(() => {
      result.current.toggle();
      result.current.toggleId(7);
    });

    act(() => result.current.exit());
    expect(result.current.isSelecting).toBe(false);
    expect(result.current.selectedIds.size).toBe(0);
  });

  it("toggleId() adds an unselected id", () => {
    const { result } = renderHook(() => useSelectionMode());
    act(() => result.current.toggleId(10));
    expect(result.current.selectedIds.has(10)).toBe(true);
  });

  it("toggleId() removes a selected id", () => {
    const { result } = renderHook(() => useSelectionMode());
    act(() => {
      result.current.toggleId(10);
      result.current.toggleId(20);
      result.current.toggleId(10);
    });
    expect(result.current.selectedIds.has(10)).toBe(false);
    expect(result.current.selectedIds.has(20)).toBe(true);
  });
});
