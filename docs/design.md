# Design — color-contrast-core

Linearize each channel (`c/12.92` below 0.03928, gamma 2.4 above), weight
0.2126/0.7152/0.0722, ratio `(L+0.05)` lighter over darker. Display rounds
to 2dp; logic uses the exact float so a 4.499 never passes AA.

Oracle: black/white exactly 21, identity exactly 1, #777/white in a tight
band, thresholds hit exactly at 7/4.5/3. No font-size semantics here —
`large` is just which threshold pair applies.
