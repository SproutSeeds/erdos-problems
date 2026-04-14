# Hardware

## Primary prototype machine

Primary CUDA target:

- OS: Windows
- GPU: RTX 4090
- role: first search rail for `frontier-engine`

## Why the 4090 is the right first target

- strong single-card throughput
- excellent CUDA development target
- simpler than assuming a multi-GPU cluster from day one
- good fit for proving whether rarity-guided search actually reduces exact work

## Prototype hardware rule

The engine should earn multi-GPU complexity.

That means:

1. prove value on the Windows 4090 box
2. make the first benchmark reproducible there
3. only then generalize to heavier rigs or multi-GPU orchestration

## Runtime posture

The first runtime split now looks like this:

- `python`
  - baseline correctness path
- `torch`
  - first device-aware batched backend
- `triton`
  - next acceleration layer, not wired yet

The intended Windows 4090 flow is:

1. use the Torch backend to prove the rail shape on CUDA
2. preserve the same candidate and artifact contracts
3. only then replace hot paths with Triton kernels

Current one-command launcher path for the 848 rail:

- `python3 research/frontier-engine/src/frontier_engine/cli.py export-p848-profile-bundle research/frontier-engine/experiments/p848-anchor-ladder/windows_rtx4090_search_profile.json`

## Legacy reference hardware

Historical systems may have assumed heavier GPU volume, including multi-card
configurations.

Those assumptions should be treated as scaling notes, not as design
requirements for the first modern scaffold.
