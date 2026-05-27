import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePinnedCampaigns } from "./use-pinned-campaigns";

describe("usePinnedCampaigns", () => {
  it("starts empty when localStorage has nothing", () => {
    const { result } = renderHook(() => usePinnedCampaigns());
    expect([...result.current.pinned]).toEqual([]);
  });

  it("hydrates from localStorage on mount", () => {
    localStorage.setItem("pinned_campaigns", JSON.stringify([1, 5, 9]));
    const { result } = renderHook(() => usePinnedCampaigns());
    expect([...result.current.pinned].sort()).toEqual([1, 5, 9]);
  });

  it("recovers from malformed localStorage value", () => {
    localStorage.setItem("pinned_campaigns", "not-json{");
    const { result } = renderHook(() => usePinnedCampaigns());
    expect([...result.current.pinned]).toEqual([]);
  });

  it("adds an id when toggling unpinned", () => {
    const { result } = renderHook(() => usePinnedCampaigns());
    act(() => result.current.toggle(42));
    expect(result.current.pinned.has(42)).toBe(true);
    expect(JSON.parse(localStorage.getItem("pinned_campaigns")!)).toEqual([42]);
  });

  it("removes an id when toggling pinned", () => {
    localStorage.setItem("pinned_campaigns", JSON.stringify([1, 2]));
    const { result } = renderHook(() => usePinnedCampaigns());
    act(() => result.current.toggle(1));
    expect(result.current.pinned.has(1)).toBe(false);
    expect(result.current.pinned.has(2)).toBe(true);
    expect(JSON.parse(localStorage.getItem("pinned_campaigns")!)).toEqual([2]);
  });

  it("handles many toggles without losing state", () => {
    const { result } = renderHook(() => usePinnedCampaigns());
    act(() => {
      result.current.toggle(1);
      result.current.toggle(2);
      result.current.toggle(3);
      result.current.toggle(2);
    });
    expect([...result.current.pinned].sort()).toEqual([1, 3]);
  });
});
