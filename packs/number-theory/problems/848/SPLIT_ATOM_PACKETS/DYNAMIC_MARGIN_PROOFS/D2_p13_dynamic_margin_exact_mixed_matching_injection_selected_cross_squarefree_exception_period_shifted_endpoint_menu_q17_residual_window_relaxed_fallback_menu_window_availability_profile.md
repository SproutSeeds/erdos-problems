# Problem 848 Endpoint Availability Profile

- Target: `q17 residual window-relaxed fallback endpoint-menu availability profile`
- Residual class: `left ≡ 5882 mod 11025`
- Windows: `25000,28500`
- Primary menu: `23,31,37,41,61,67`
- Fallback menu: `71,73,79,83,89,97,101,103,107,109,113`

## Window Thresholds

- window=25000: endpoint is available iff `k <= 999`; minimal exact threshold window is `24989`
- window=28500: endpoint is available iff `k <= 1139`; minimal exact threshold window is `28489`

## Availability By Prime

- p=23: `k_23(left) = (127*left + 79) mod 529`
- p=23, window=25000: `k_23(t) = (441*t + 145) mod 529`, t-period `529`, available `529/529`, universal `true`
- p=23, window=28500: `k_23(t) = (441*t + 145) mod 529`, t-period `529`, available `529/529`, universal `true`
- p=31: `k_31(left) = (346*left + 669) mod 961`
- p=31, window=25000: `k_31(t) = (441*t + 443) mod 961`, t-period `961`, available `961/961`, universal `true`
- p=31, window=28500: `k_31(t) = (441*t + 443) mod 961`, t-period `961`, available `961/961`, universal `true`
- p=37: `k_37(left) = (1150*left + 651) mod 1369`
- p=37, window=25000: `k_37(t) = (441*t + 722) mod 1369`, t-period `1369`, available `1000/1369`, universal `false`
- p=37, window=28500: `k_37(t) = (441*t + 722) mod 1369`, t-period `1369`, available `1140/1369`, universal `false`
- p=41: `k_41(left) = (269*left + 1029) mod 1681`
- p=41, window=25000: `k_41(t) = (441*t + 1466) mod 1681`, t-period `1681`, available `1000/1681`, universal `false`
- p=41, window=28500: `k_41(t) = (441*t + 1466) mod 1681`, t-period `1681`, available `1140/1681`, universal `false`
- p=61: `k_61(left) = (2828*left + 2221) mod 3721`
- p=61, window=25000: `k_61(t) = (441*t + 3647) mod 3721`, t-period `3721`, available `1000/3721`, universal `false`
- p=61, window=28500: `k_61(t) = (441*t + 3647) mod 3721`, t-period `3721`, available `1140/3721`, universal `false`
- p=67: `k_67(left) = (2873*left + 511) mod 4489`
- p=67, window=25000: `k_67(t) = (441*t + 2901) mod 4489`, t-period `4489`, available `1000/4489`, universal `false`
- p=67, window=28500: `k_67(t) = (441*t + 2901) mod 4489`, t-period `4489`, available `1140/4489`, universal `false`
- p=71: `k_71(left) = (2823*left + 4760) mod 5041`
- p=71, window=25000: `k_71(t) = (441*t + 4592) mod 5041`, t-period `5041`, available `1000/5041`, universal `false`
- p=71, window=28500: `k_71(t) = (441*t + 4592) mod 5041`, t-period `5041`, available `1140/5041`, universal `false`
- p=73: `k_73(left) = (1279*left + 5218) mod 5329`
- p=73, window=25000: `k_73(t) = (441*t + 3748) mod 5329`, t-period `5329`, available `1000/5329`, universal `false`
- p=73, window=28500: `k_73(t) = (441*t + 3748) mod 5329`, t-period `5329`, available `1140/5329`, universal `false`
- p=79: `k_79(left) = (3495*left + 4770) mod 6241`
- p=79, window=25000: `k_79(t) = (441*t + 4506) mod 6241`, t-period `6241`, available `1000/6241`, universal `false`
- p=79, window=28500: `k_79(t) = (441*t + 4506) mod 6241`, t-period `6241`, available `1140/6241`, universal `false`
- p=83: `k_83(left) = (4409*left + 2738) mod 6889`
- p=83, window=25000: `k_83(t) = (441*t + 6280) mod 6889`, t-period `6889`, available `1000/6889`, universal `false`
- p=83, window=28500: `k_83(t) = (441*t + 6280) mod 6889`, t-period `6889`, available `1140/6889`, universal `false`
- p=89: `k_89(left) = (6020*left + 1152) mod 7921`
- p=89, window=25000: `k_89(t) = (441*t + 3922) mod 7921`, t-period `7921`, available `1000/7921`, universal `false`
- p=89, window=28500: `k_89(t) = (441*t + 3922) mod 7921`, t-period `7921`, available `1140/7921`, universal `false`
- p=97: `k_97(left) = (4140*left + 4932) mod 9409`
- p=97, window=25000: `k_97(t) = (441*t + 5920) mod 9409`, t-period `9409`, available `1000/9409`, universal `false`
- p=97, window=28500: `k_97(t) = (441*t + 5920) mod 9409`, t-period `9409`, available `1140/9409`, universal `false`
- p=101: `k_101(left) = (9793*left + 9742) mod 10201`
- p=101, window=25000: `k_101(t) = (441*t + 7121) mod 10201`, t-period `10201`, available `1000/10201`, universal `false`
- p=101, window=28500: `k_101(t) = (441*t + 7121) mod 10201`, t-period `10201`, available `1140/10201`, universal `false`
- p=103: `k_103(left) = (4668*left + 4197) mod 10609`
- p=103, window=25000: `k_103(t) = (441*t + 5281) mod 10609`, t-period `10609`, available `1000/10609`, universal `false`
- p=103, window=28500: `k_103(t) = (441*t + 5281) mod 10609`, t-period `10609`, available `1140/10609`, universal `false`
- p=107: `k_107(left) = (458*left + 2044) mod 11449`
- p=107, window=25000: `k_107(t) = (441*t + 5485) mod 11449`, t-period `11449`, available `1000/11449`, universal `false`
- p=107, window=28500: `k_107(t) = (441*t + 5485) mod 11449`, t-period `11449`, available `1140/11449`, universal `false`
- p=109: `k_109(left) = (1901*left + 4499) mod 11881`
- p=109, window=25000: `k_109(t) = (441*t + 6160) mod 11881`, t-period `11881`, available `1000/11881`, universal `false`
- p=109, window=28500: `k_109(t) = (441*t + 6160) mod 11881`, t-period `11881`, available `1140/11881`, universal `false`
- p=113: `k_113(left) = (10726*left + 9326) mod 12769`
- p=113, window=25000: `k_113(t) = (441*t + 8029) mod 12769`, t-period `12769`, available `1000/12769`, universal `false`
- p=113, window=28500: `k_113(t) = (441*t + 8029) mod 12769`, t-period `12769`, available `1140/12769`, universal `false`

## Witness Rows

- left=34414907: p=23: k=48, delta=-1214, windows={"25000":true,"28500":true}; p=31: k=652, delta=-16314, windows={"25000":true,"28500":true}; p=37: k=1238, delta=-30964, windows={"25000":false,"28500":false}; p=41: k=1088, delta=-27214, windows={"25000":false,"28500":true}; p=61: k=3238, delta=-80964, windows={"25000":false,"28500":false}; p=67: k=1139, delta=-28489, windows={"25000":false,"28500":true}; p=71: k=4760, delta=-119014, windows={"25000":false,"28500":false}; p=73: k=5227, delta=-130689, windows={"25000":false,"28500":false}; p=79: k=1606, delta=-40164, windows={"25000":false,"28500":false}; p=83: k=4841, delta=-121039, windows={"25000":false,"28500":false}; p=89: k=2029, delta=-50739, windows={"25000":false,"28500":false}; p=97: k=8567, delta=-214189, windows={"25000":false,"28500":false}; p=101: k=6347, delta=-158689, windows={"25000":false,"28500":false}; p=103: k=2472, delta=-61814, windows={"25000":false,"28500":false}; p=107: k=7966, delta=-199164, windows={"25000":false,"28500":false}; p=109: k=4325, delta=-108139, windows={"25000":false,"28500":false}; p=113: k=5338, delta=-133464, windows={"25000":false,"28500":false}

## Next Theorem Options

- `availability_residue_cover` [ready]: Use the k-threshold rules to split endpoint availability into finite t-residue strata before proving squarefree hitting.
- `window_legality_threshold` [ready]: The candidate windows have thresholds 25000->k<=999, 28500->k<=1139; prove which threshold is theorem-legal.

## Boundary

- This profile proves modular endpoint availability only. Squarefree hitting and matching remain separate layers.

