"""Exact verifier interfaces for frontier-engine."""

from __future__ import annotations

from typing import Protocol

from .contracts import FrontierItem, VerificationRequest, VerificationResult


class ExactVerifier(Protocol):
    """Run exact work on promoted frontier items."""

    def verify(self, requests: list[VerificationRequest]) -> list[VerificationResult]:
        """Return exact verification results."""


class NullVerifier:
    """Placeholder verifier until a SAT or exact backend is attached."""

    def build_requests(self, items: list[FrontierItem]) -> list[VerificationRequest]:
        return [
            VerificationRequest(
                request_id=f"verify:{item.candidate.candidate_id}",
                candidate_id=item.candidate.candidate_id,
                payload=item.candidate.payload,
                backend="null",
            )
            for item in items
        ]

    def verify(self, requests: list[VerificationRequest]) -> list[VerificationResult]:
        return [
            VerificationResult(
                request_id=request.request_id,
                candidate_id=request.candidate_id,
                status="unverified_placeholder",
                metadata={"backend": request.backend},
            )
            for request in requests
        ]


class SatSeedBundleVerifier:
    """Prepare promoted candidates as SAT-facing seed work packets."""

    def build_requests(self, items: list[FrontierItem]) -> list[VerificationRequest]:
        return [
            VerificationRequest(
                request_id=f"seed:{item.candidate.candidate_id}",
                candidate_id=item.candidate.candidate_id,
                payload={
                    "benchmark_id": item.candidate.payload["benchmark_id"],
                    "n": item.candidate.payload["n"],
                    "k": item.candidate.payload["k"],
                    "family_size": item.candidate.payload["target_family_size"],
                    "family": item.candidate.payload["family_masks"],
                    "observed_sunflower_triple_count": item.candidate.payload[
                        "sunflower_triple_count"
                    ],
                },
                backend="sat_seed_bundle",
            )
            for item in items
        ]

    def verify(self, requests: list[VerificationRequest]) -> list[VerificationResult]:
        return [
            VerificationResult(
                request_id=request.request_id,
                candidate_id=request.candidate_id,
                status="seed_bundle_ready",
                metadata={
                    "backend": request.backend,
                    "family_size": request.payload["family_size"],
                    "observed_sunflower_triple_count": request.payload[
                        "observed_sunflower_triple_count"
                    ],
                },
            )
            for request in requests
        ]
