# Erdos Problems Adapter

This document describes the boundary to `erdos-problems`.

## What should stay outside for now

Do not pull these directly into the packaged CLI yet:

- Triton kernels
- GPU tuning logic
- surrogate training code
- raw experiment caches
- device-specific batching heuristics

These belong to `frontier-engine` until the system is stable and benchmarked.

## What may later flow into `erdos-problems`

Only promoted, claim-safe artifacts should cross the boundary:

- run summaries
- frontier reduction ledgers
- promoted verifier task bundles
- exact certificates or exact witness packets
- benchmark comparison notes

## Desired eventual integration

Once earned, the adapter can expose:

- problem-specific frontier status
- governed local search launches
- artifact ingest into problem evidence
- exact verifier bundles tied to problem ids

## Guardrail

The adapter must never silently inflate:

- search progress into solved-problem claims
- surrogate wins into exact mathematical results
- hardware throughput into proof evidence
