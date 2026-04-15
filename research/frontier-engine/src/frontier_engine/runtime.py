"""Runtime probing and selection for frontier-engine search backends."""

from __future__ import annotations

from dataclasses import asdict, dataclass
import importlib.util
from typing import Any


@dataclass
class RuntimeProbe:
    """Local capability snapshot for optional acceleration backends."""

    torch_installed: bool
    torch_version: str | None
    cuda_available: bool
    cuda_device_count: int
    cuda_device_name: str | None
    triton_installed: bool

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def probe_runtime() -> RuntimeProbe:
    """Return the available optional runtime capabilities."""

    triton_installed = importlib.util.find_spec("triton") is not None
    torch_spec = importlib.util.find_spec("torch")
    if torch_spec is None:
        return RuntimeProbe(
            torch_installed=False,
            torch_version=None,
            cuda_available=False,
            cuda_device_count=0,
            cuda_device_name=None,
            triton_installed=triton_installed,
        )

    import torch

    cuda_available = bool(torch.cuda.is_available())
    cuda_device_count = int(torch.cuda.device_count()) if cuda_available else 0
    cuda_device_name = torch.cuda.get_device_name(0) if cuda_device_count else None
    return RuntimeProbe(
        torch_installed=True,
        torch_version=str(getattr(torch, "__version__", "")) or None,
        cuda_available=cuda_available,
        cuda_device_count=cuda_device_count,
        cuda_device_name=cuda_device_name,
        triton_installed=triton_installed,
    )


def resolve_runtime_mode(requested_runtime: str, probe: RuntimeProbe) -> str:
    """Resolve `auto` into a concrete backend name."""

    if requested_runtime == "auto":
        return "torch" if probe.torch_installed else "python"
    if requested_runtime == "torch" and not probe.torch_installed:
        raise RuntimeError("runtime='torch' requested, but torch is not installed")
    if requested_runtime not in {"python", "torch"}:
        raise ValueError(f"unknown runtime mode: {requested_runtime}")
    return requested_runtime


def resolve_device(requested_device: str, runtime_mode: str, probe: RuntimeProbe) -> str:
    """Resolve device selection for the chosen runtime."""

    if runtime_mode == "python":
        return "cpu"
    if requested_device == "auto":
        return "cuda" if probe.cuda_available else "cpu"
    if requested_device == "cuda" and not probe.cuda_available:
        raise RuntimeError("device='cuda' requested, but no CUDA device is available")
    if requested_device not in {"cpu", "cuda"}:
        raise ValueError(f"unknown device selection: {requested_device}")
    return requested_device
