# Problem 848 Endpoint Menu Compiler

- Target: `q17 residual window-relaxed fallback endpoint-menu selector`
- Residual class: `left ≡ 5882 mod 11025`
- Scan: `34414907..34414907` over `1` residual rows
- Window: `25000`
- Square check: `No full-menu covered endpoint was selected in this profile; inspect candidate square-divisor statuses and window availability.`
- Primary menu: `23,31,37,41,61,67`
- Fallback menu: `71,73,79,83,89,97,101,103,107,109,113`

## Endpoint Formulas

- p=23: `k_23(left) = (127*left + 79) mod 529`; delta range `-13214..-14`; within 25000: `true`
- p=31: `k_31(left) = (346*left + 669) mod 961`; delta range `-24014..-14`; within 25000: `true`
- p=37: `k_37(left) = (1150*left + 651) mod 1369`; delta range `-34214..-14`; within 25000: `false`
- p=41: `k_41(left) = (269*left + 1029) mod 1681`; delta range `-42014..-14`; within 25000: `false`
- p=61: `k_61(left) = (2828*left + 2221) mod 3721`; delta range `-93014..-14`; within 25000: `false`
- p=67: `k_67(left) = (2873*left + 511) mod 4489`; delta range `-112214..-14`; within 25000: `false`
- p=71: `k_71(left) = (2823*left + 4760) mod 5041`; delta range `-126014..-14`; within 25000: `false`
- p=73: `k_73(left) = (1279*left + 5218) mod 5329`; delta range `-133214..-14`; within 25000: `false`
- p=79: `k_79(left) = (3495*left + 4770) mod 6241`; delta range `-156014..-14`; within 25000: `false`
- p=83: `k_83(left) = (4409*left + 2738) mod 6889`; delta range `-172214..-14`; within 25000: `false`
- p=89: `k_89(left) = (6020*left + 1152) mod 7921`; delta range `-198014..-14`; within 25000: `false`
- p=97: `k_97(left) = (4140*left + 4932) mod 9409`; delta range `-235214..-14`; within 25000: `false`
- p=101: `k_101(left) = (9793*left + 9742) mod 10201`; delta range `-255014..-14`; within 25000: `false`
- p=103: `k_103(left) = (4668*left + 4197) mod 10609`; delta range `-265214..-14`; within 25000: `false`
- p=107: `k_107(left) = (458*left + 2044) mod 11449`; delta range `-286214..-14`; within 25000: `false`
- p=109: `k_109(left) = (1901*left + 4499) mod 11881`; delta range `-297014..-14`; within 25000: `false`
- p=113: `k_113(left) = (10726*left + 9326) mod 12769`; delta range `-319214..-14`; within 25000: `false`

## Coverage

- Primary covered: `0/1`
- Full menu covered: `0/1`
- First primary miss: `34414907`
- First full-menu miss: `34414907`
- Primary cover prime counts: `[]`
- Full cover prime counts: `[]`

## First Full-Menu Miss Detail

- Left: `34414907`
- Left residual: `5882`
- Blocked within-window endpoints: `[{"prime":23,"k":48,"delta":-1214,"right":34413693,"withinWindow":true,"squarefreeStatus":"non_squarefree","squareDivisorPrime":2,"squareDivisor":4,"checkedSquarePrimeLimit":34414903},{"prime":31,"k":652,"delta":-16314,"right":34398593,"withinWindow":true,"squarefreeStatus":"non_squarefree","squareDivisorPrime":2,"squareDivisor":4,"checkedSquarePrimeLimit":34414903}]`
- Nearest unblocked outside-window endpoints: `[{"prime":67,"k":1139,"delta":-28489,"right":34386418,"withinWindow":false,"squarefreeStatus":"exact_squarefree","squareDivisorPrime":null,"squareDivisor":null,"checkedSquarePrimeLimit":34414903},{"prime":37,"k":1238,"delta":-30964,"right":34383943,"withinWindow":false,"squarefreeStatus":"exact_squarefree","squareDivisorPrime":null,"squareDivisor":null,"checkedSquarePrimeLimit":34414903},{"prime":79,"k":1606,"delta":-40164,"right":34374743,"withinWindow":false,"squarefreeStatus":"exact_squarefree","squareDivisorPrime":null,"squareDivisor":null,"checkedSquarePrimeLimit":34414903},{"prime":89,"k":2029,"delta":-50739,"right":34364168,"withinWindow":false,"squarefreeStatus":"exact_squarefree","squareDivisorPrime":null,"squareDivisor":null,"checkedSquarePrimeLimit":34414903},{"prime":61,"k":3238,"delta":-80964,"right":34333943,"withinWindow":false,"squarefreeStatus":"exact_squarefree","squareDivisorPrime":null,"squareDivisor":null,"checkedSquarePrimeLimit":34414903}]`

## Next Theorem Options

- `primary_menu_first_miss` [needed]: The primary menu misses at left=34414907; inspect this miss before adding more abstraction.
- `full_menu_first_miss` [needed]: The full menu misses at left=34414907; emit this row as the next deterministic obstruction.
- `fallback_window_availability_split` [optional]: Some fallback primes are not universally inside the window; split fallback usage into availability residues before relying on them symbolically.

## Boundary

- This compiler proves endpoint formulas and bounded coverage profiles only.
- It does not prove all-N squarefree hitting or collision-free matching by itself.

