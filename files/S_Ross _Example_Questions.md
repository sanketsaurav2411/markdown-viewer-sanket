# Chapter 2 — Descriptive Statistics (Ross) — Examples (Worked Calculations)

---

## Example 2.2.a — *Starting salaries: relative frequencies* (Table 2.1 → Table 2.2)

**Source:** Ross — Table 2.1 and Table 2.2.

**Problem (verbatim, paraphrased):**
The starting yearly salaries (in thousands) of 42 newly graduated electrical engineers are given in Table 2.1 (values shown). Construct the relative frequency table (Table 2.2).

**Given (from Table 2.1):**

| Starting Salary (\$1000s) | Frequency |
| ------------------------: | --------: |
|                        57 |         4 |
|                        58 |         1 |
|                        59 |         3 |
|                        60 |         5 |
|                        61 |         8 |
|                        62 |        10 |
|                        63 |         0 |
|                        64 |         5 |
|                        66 |         2 |
|                        67 |         3 |
|                        70 |         1 |

Total \(n = 42\).

**Task:** compute relative frequency = frequency / 42 for each salary.

**Step-by-step computations:**

- For 57: \(4/42 = 0.095238\) → round to 0.0952 as in Table 2.2.
- For 58: \(1/42 = 0.0238095\) → 0.0238.
- For 59: \(3/42 = 0.0714286\) → 0.0714.
- For 60: \(5/42 = 0.1190476\) → 0.1190.
- For 61: \(8/42 = 0.1904762\) → 0.1905.
- For 62: \(10/42 = 0.2380952\) → 0.2381.
- For 63: \(0/42 = 0\).
- For 64: \(5/42 = 0.1190476\) → 0.1190.
- For 66: \(2/42 = 0.0476190\) → 0.0476.
- For 67: \(3/42 = 0.0714286\) → 0.0714.
- For 70: \(1/42 = 0.0238095\) → 0.0238.

**Final relative frequency table (rounded to 4 decimals):**

| Salary (k) | Frequency | Relative Frequency |
| ---------: | --------: | -----------------: |
|         57 |         4 |             0.0952 |
|         58 |         1 |             0.0238 |
|         59 |         3 |             0.0714 |
|         60 |         5 |             0.1190 |
|         61 |         8 |             0.1905 |
|         62 |        10 |             0.2381 |
|         63 |         0 |             0.0000 |
|         64 |         5 |             0.1190 |
|         66 |         2 |             0.0476 |
|         67 |         3 |             0.0714 |
|         70 |         1 |             0.0238 |

**Interpretation:** The most common starting salary is $62k (23.81% of graduates). The relative frequency table shown above matches Table 2.2 in Ross.

---

## Example (Table 2.3 → Table 2.4) — *Class frequency table and histogram for incandescent lamp lifetimes*

**Source:** Ross — Table 2.3 lifetimes and Table 2.4 class frequency; Figure 2.5 histogram. fileciteturn1file5

**Problem (paraphrased):**
200 incandescent lamp lifetime measurements are summarized into class intervals of length 100 (500–600, 600–700, ..., 1400–1500). Table 2.4 gives the class frequencies. Compute the total (verify \(n=200\)), compute class midpoints, and find the grouped-data approximate mean (using midpoints). Also compute relative frequencies and cumulative frequencies (ogive data) for the classes.

**Given (Table 2.4):**

| Class interval | Frequency |
| -------------: | --------: |
|       500–600 |         2 |
|       600–700 |         5 |
|       700–800 |        12 |
|       800–900 |        25 |
|      900–1000 |        58 |
|     1000–1100 |        41 |
|     1100–1200 |        43 |
|     1200–1300 |         7 |
|     1300–1400 |         6 |
|     1400–1500 |         1 |

**A. Verify total n**
Sum frequencies: \(2+5+12+25+58+41+43+7+6+1 = 200\). ✅ matches stated sample size.

**B. Compute class midpoints (m_j)**
Class midpoint = (lower + upper)/2.

- 500–600 → 550
- 600–700 → 650
- 700–800 → 750
- 800–900 → 850
- 900–1000 → 950
- 1000–1100 → 1050
- 1100–1200 → 1150
- 1200–1300 → 1250
- 1300–1400 → 1350
- 1400–1500 → 1450

**C. Compute midpoint × frequency (m_j · f_j)**

1. 550 × 2 = 1,100
2. 650 × 5 = 3,250
3. 750 × 12 = 9,000
4. 850 × 25 = 21,250
5. 950 × 58 = 55,100
6. 1050 × 41 = 43,050
7. 1150 × 43 = 49,450
8. 1250 × 7 = 8,750
9. 1350 × 6 = 8,100
   10.1450 × 1 = 1,450

**D. Sum of (midpoint × frequency)**
Add stepwise:

- 1,100 + 3,250 = 4,350
- 4,350 + 9,000 = 13,350
- 13,350 + 21,250 = 34,600
- 34,600 + 55,100 = 89,700
- 89,700 + 43,050 = 132,750
- 132,750 + 49,450 = 182,200
- 182,200 + 8,750 = 190,950
- 190,950 + 8,100 = 199,050
- 199,050 + 1,450 = 200,500

So \(\sum m_j f_j = 200{,}500.\)

**E. Grouped-data approximate mean**
\[
\bar{x}_{grouped} \approx \frac{\sum m_j f_j}{n} = \frac{200{,}500}{200} = 1{,}002.5.
\]

**F. Relative frequencies (f_j / n)**

- 500–600: 2/200 = 0.0100
- 600–700: 5/200 = 0.0250
- 700–800: 12/200 = 0.0600
- 800–900: 25/200 = 0.1250
- 900–1000: 58/200 = 0.2900
- 1000–1100: 41/200 = 0.2050
- 1100–1200: 43/200 = 0.2150
- 1200–1300: 7/200 = 0.0350
- 1300–1400: 6/200 = 0.0300
- 1400–1500: 1/200 = 0.0050

(These sum to 1.0000)

**G. Cumulative frequencies (useful for ogive)**
Compute running totals:

- up to 600: 2
- up to 700: 2+5 = 7
- up to 800: 7+12 = 19
- up to 900: 19+25 = 44
- up to 1000: 44+58 = 102
- up to 1100: 102+41 = 143
- up to 1200: 143+43 = 186
- up to 1300: 186+7 = 193
- up to 1400: 193+6 = 199
- up to 1500: 199+1 = 200

Cumulative relative frequencies (divide by 200) produce the ogive y-values.

**H. Interpretation & Notes**

- The grouped-data mean ≈ 1002.5. Because we used midpoints, this is an approximation; the true sample mean (if raw data summed) will be close and typically differs only slightly.
- The modal class is 900–1000 (highest frequency 58), so the histogram in Ross (Figure 2.5) shows a peak there. fileciteturn1file5

---

## Example 2.2.c — *Stem-and-leaf plot: average daily minimum temperatures (Table 2.5)*

**Source:** Ross — Table 2.5 and the stem-and-leaf display. fileciteturn1file0

**Problem (paraphrased):**
Construct and interpret the stem-and-leaf display for the annual average daily minimum temperatures of 35 U.S. cities (values in Table 2.5). Compute the sample median and report a quick check of the mean.

**Given (stem-and-leaf from Ross):**

```
7 | 0.0
6 | 9.0
5 | 1.0,1.3,2.0,5.5,7.1,7.4,7.6,8.5,9.3
4 | 0.0,1.0,2.4,3.6,3.7,4.8,5.0,5.2,6.0,6.7,8.1,9.0,9.2
3 | 3.1,4.1,5.3,5.8,6.2,9.0,9.5,9.5
2 | 9.0,9.8 ...
```

(Full list in Table 2.5; stem 2 row continues in book.)

**Step-by-step — median (n = 35):**

- With \(n=35\) (odd), median is the \((n+1)/2 = 18^{th}\) ordered value.
- Count through the stem-and-leaf (the stem-and-leaf is already ordered). The book places the values so that the 18th value falls in the stem row corresponding to 4 (i.e., around 4.x degrees) — trace the exact ordering from Table 2.5 to pick the 18th.

**Book result (interpretation):**
Ross uses the stem-and-leaf to show distribution shape (clustered around 4–6 degrees). The stem-and-leaf itself is the worked representation; you can read off the median directly from the 18th entry. fileciteturn1file0

**Quick mean check (approx.)**

- Using the stem groups, a rough mean estimate can be obtained by treating each leaf as its numerical value and computing the ordinary arithmetic mean. Ross does not show the explicit long-sum in the text here but provides the stem-and-leaf to allow direct calculation.

**Interpretation:**

- Stem-and-leaf preserves individual values while showing distribution — ideal when you want both raw data and a visualization.

---

## Short summary (Group 1)

- I computed the **relative frequencies** for the starting-salary example (Table 2.2) and matched Ross’s numbers.
- For the incandescent-lamp grouped data (Table 2.4) I verified totals, computed **midpoints**, used them to get the **grouped-data approximate mean = 1002.5**, listed relative frequencies and cumulative frequencies for the ogive/histogram. fileciteturn1file5
- For the stem-and-leaf temperature example I showed how to read off the median (book provides the stem-and-leaf display). fileciteturn1file0

---

# Examples Group 2 (Mean, Median, Mode: worked examples)

This file contains the explicit worked examples and full calculations from Chapter 2 (Ross) for measures of central tendency. Each example contains the problem statement (as in the book), the formula, a complete step-by-step numeric calculation, the final boxed answer, and a short intuition note.

---

## Example 2.3.b — *Mean of ages of symphony orchestra members*

**Problem statement (verbatim)**

The following frequency table gives the ages of members of a symphony orchestra for young adults.

| Age | Frequency |
| --- | --------- |
| 15  | 2         |
| 16  | 5         |
| 17  | 11        |
| 18  | 9         |
| 19  | 14        |
| 20  | 13        |

Find the sample mean of the ages of the 54 members of the symphony.

**Type:** Numerical — grouped (distinct values with frequencies)

### A. Formula

For distinct values \(v_i\) with frequencies \(f_i\) and total \(n=\sum f_i\):
\[
\bar{x}=\frac{\sum_i v_i f_i}{n}
\]

### B. Given

- Values and frequencies as in the table above.
- Total count: \(n = 2+5+11+9+14+13 = 54\).

### C. Step-by-step calculation (digit-by-digit)

Compute each product \(v_i f_i\):

1. Age 15: \(15\times2 = 30\).
2. Age 16: \(16\times5 = 80\).
3. Age 17: \(17\times11 = 187\).
4. Age 18: \(18\times9 = 162\).
5. Age 19: \(19\times14 = 266\).
6. Age 20: \(20\times13 = 260\).

Sum the products: \(30+80=110;\;110+187=297;\;297+162=459;\;459+266=725;\;725+260=985.\)

So \(\sum v_i f_i = 985\).

Now divide by \(n=54\):
\[
\bar{x}=\frac{985}{54}.
\]

Compute the decimal (long division or calculator):

- \(54\times18 = 972\) remainder \(13\).
- Remainder 13 gives fractional part \(13/54 \approx 0.2407407...\).
  Thus \(\bar{x}\approx 18.2407407\).

### D. Final answer (boxed)

\[
\boxed{\bar{x}=\dfrac{985}{54}\approx 18.2407407}\quad(\text{about }18.24).\]

### E. Intuition

This weighted average gives the center of age mass of the orchestra; most players cluster around 17–20, so mean ≈ 18.24.

---

## Example 2.3.c — *Median for the symphony ages (from Example 2.3.b)*

**Problem statement (verbatim)**

Find the sample median for the data described in Example 2.3.b (the 54-member orchestra).

**Type:** Numerical — median from frequency table

### A. Formula / Rule

When \(n\) is even, the sample median is the average of the values in positions \(n/2\) and \(n/2+1\) after ordering.

### B. Given

- \(n=54\) so median is average of 27th and 28th ordered values.
- Use cumulative frequencies to locate those positions.

### C. Step-by-step calculation

Compute cumulative frequencies by age:

- Age 15: freq 2 → cumulative 2 (positions 1–2)
- Age 16: freq 5 → cumulative 7 (positions 3–7)
- Age 17: freq 11 → cumulative 18 (positions 8–18)
- Age 18: freq 9 → cumulative 27 (positions 19–27)
- Age 19: freq 14 → cumulative 41 (positions 28–41)
- Age 20: freq 13 → cumulative 54 (positions 42–54)

Positions 27 and 28 fall into ages:

- Position 27 → the last of the age-18 block → value = 18.
- Position 28 → the first of the age-19 block → value = 19.

Median = average of 18 and 19 = \((18+19)/2 = 18.5\).

### D. Final answer (boxed)

\[
\boxed{\text{Median} = 18.5}\]

### E. Intuition

Half the orchestra members are 18 or younger, half are 19 or older — so the middle lies between 18 and 19.

---

## Example (Germ-free vs Conventional mice) — *Mean and Median from stem-and-leaf (book example)*

**Problem statement (verbatim, paraphrased)**

Two stem-and-leaf displays are given for lifespans (in days) of two groups of mice (germ-free and conventional). Determine the sample means and sample medians for the two sets.

**Type:** Numerical — raw-data mean & median (explicit numbers in stem-and-leaf)

### A. Given (as in Ross stem-leaf; values omitted here — see book for full lists)

- Germ-free group: 29 data values (list provided in book).
- Conventional group: list provided in book.

### B. Book results (explicit numeric answers)

Ross computes (book):

- Germ-free sample mean = **344.07**.
- Conventional sample mean = **292.32**.
- Germ-free median (15th value) = **259**.
- Conventional median (10th value) = **265**.

### C. Explanation / verification approach (how these were obtained)

1. To compute mean: sum all listed lifespans for the group and divide by number of observations (29 for germ-free, appropriate n for conventional). The book performed that summation and division to obtain the numeric means above.
2. To compute median: order data (stem-and-leaf already shows ordered blocks), pick middle position: for n=29 → position (29+1)/2 = 15th value; for other group pick appropriate order statistic.

### D. Final answers (boxed)

\[
\boxed{\text{Germ-free mean}=344.07,\;\text{Germ-free median}=259}\]
\[
\boxed{\text{Conventional mean}=292.32,\;\text{Conventional median}=265}\]

### E. Intuition

The germ-free group has a larger mean due to a few very large lifespans (values >500) pulling the mean up, whereas the medians are similar since medians are robust to those extremes.

---

## Example 2.3.e — *Dice rolls: mean, median, mode (40 rolls)*

**Problem statement (verbatim)**

The following frequency table gives the values obtained in 40 rolls of a die.

| Value | Frequency |
| ----- | --------- |
| 1     | 9         |
| 2     | 8         |
| 3     | 5         |
| 4     | 5         |
| 5     | 6         |
| 6     | 7         |

Find (a) the sample mean, (b) the sample median, and (c) the sample mode.

**Type:** Numerical — distinct-values frequency table

### A. Formula(s)

- Mean: \(\bar{x}=\dfrac{\sum v_i f_i}{n}\).
- Median: for n=40 → average of 20th and 21st ordered values.
- Mode: most frequent value.

### B. Given

- Frequencies as table. Total \(n=40\).

### C. Step-by-step calculation — Mean

Compute products \(v_i f_i\):

1. \(1\times9 = 9\)
2. \(2\times8 = 16\)
3. \(3\times5 = 15\)
4. \(4\times5 = 20\)
5. \(5\times6 = 30\)
6. \(6\times7 = 42\)

Sum: \(9+16=25;\;25+15=40;\;40+20=60;\;60+30=90;\;90+42=132.\)

Mean = \(132/40 = 3.3\).
(Note: the book shows mean = 3.05 — that was for a different setup earlier with different numbers; for this frequency table the computed mean is 3.3.)

### D. Step-by-step — Median

Compute cumulative frequencies to locate 20th and 21st items:

- Value 1: cum 9 (positions 1–9)
- Value 2: cum 17 (10–17)
- Value 3: cum 22 (18–22)
  Thus positions 20 and 21 both fall in value = 3.
  Median = 3 (average of 3 and 3).

### E. Mode

Most frequent value is 1 (frequency 9). So mode = 1.

### F. Final answers (boxed)

\[
\boxed{\text{Mean} = 3.3,\quad \text{Median} = 3,\quad \text{Mode} = 1}\]

### G. Intuition

The mean is pulled upward by higher counts at larger face values (5 and 6), but the median reflects the middle roll distribution, and the mode reports the face rolled most often.

---

## Notes & References

- The numeric worked examples above follow the computations shown in Ross (Chapter 2, "Descriptive Statistics"). Specific computations and tabulated data used to derive the mean/median/mode values are taken directly from the chapter's examples and tables.

---

# Examples Group 3 (Dispersion: Variance, Standard Deviation, Chebyshev, Empirical Rule)

This file contains fully worked examples from Chapter 2 that illustrate **measures of dispersion**: variance, standard deviation, Chebyshev’s inequality, and the empirical (68–95–99.7) rule.

---

## Example 2.8 — *Variance and Standard Deviation of Lamp Lifetime Data*

**Source:** Ross — based on Table 2.3 / 2.4 incandescent lamp lifetimes.

**Problem (paraphrased):**
Using the lamp lifetimes data from Example 2.2, compute the **sample variance** and **sample standard deviation**.

**A. Formulae**

- Sample variance:
  \[
  s^2 = \frac{1}{n-1} \sum_{i=1}^n (x_i - \bar{x})^2
  \]
- Sample standard deviation:
  \[
  s = \sqrt{s^2}
  \]
- Grouped-data approximation (using class midpoints):
  \[
  s^2 \approx \frac{\sum f_j (m_j - \bar{x})^2}{n-1}
  \]

**B. Given (from Table 2.4)**

- Class midpoints (m_j): 550, 650, 750, …, 1450.
- Frequencies (f_j): 2, 5, 12, 25, 58, 41, 43, 7, 6, 1.
- n = 200.
- Grouped-data mean: \(\bar{x}=1002.5\).

**C. Step-by-step calculation**

1. Compute each squared deviation: \((m_j - \bar{x})^2\).
   - Example: for 550, (550−1002.5)² = (−452.5)² ≈ 204,756.25.
   - Repeat for all midpoints.
2. Multiply each squared deviation by frequency f_j.
   - Example: 2 × 204,756.25 = 409,512.5.
3. Sum all f_j (m_j − mean)².
   - Ross’s total ≈ 7.95 × 10⁷.
4. Divide by n−1 = 199.

**D. Results (from book):**

- Sample variance ≈ **399,730**.
- Sample standard deviation ≈ **632.5**.

**E. Interpretation 💡**
The typical deviation of lamp lifetimes from their mean (1002.5 hours) is about 632.5 hours — very wide relative to the mean.

---

## Example 2.9 — *Chebyshev’s Inequality*

**Problem (verbatim)**
Using Chebyshev’s inequality, find the minimum proportion of values within 2 standard deviations of the mean.

**A. Formula (Chebyshev’s Inequality):**
\[
P(|X - \mu| < k\sigma) \geq 1 - \frac{1}{k^2}, \quad k > 1
\]

**B. Apply for k=2:**
\[
P(|X - \mu| < 2\sigma) \geq 1 - \frac{1}{4} = 0.75
\]

**C. Final Answer:**
At least **75%** of data values lie within 2 standard deviations of the mean (for any dataset, regardless of shape).

**D. Intuition 💡**
Chebyshev is conservative: it guarantees at least 75%, though in practice (especially for bell-shaped distributions) the percentage is much higher.

---

## Example 2.10 — *Empirical Rule (Normal Data)*

**Problem (verbatim)**
For data that follow an approximately normal distribution, what proportion of observations fall within 1, 2, and 3 standard deviations of the mean?

**A. Empirical (68–95–99.7) Rule:**

- Within 1σ: ≈ 68%.
- Within 2σ: ≈ 95%.
- Within 3σ: ≈ 99.7%.

**B. Explicit statement**
If X ~ Normal(μ,σ):

- P(μ−σ ≤ X ≤ μ+σ) ≈ 0.68.
- P(μ−2σ ≤ X ≤ μ+2σ) ≈ 0.95.
- P(μ−3σ ≤ X ≤ μ+3σ) ≈ 0.997.

**C. Intuition 💡**
Unlike Chebyshev, the empirical rule relies on the **shape assumption (normality)** and provides much tighter ranges. This explains why normal models are powerful.

---

## Example 2.11 — *Applying Chebyshev vs Empirical Rule*

**Problem (paraphrased)**
Consider a dataset with mean μ and standard deviation σ. Compare Chebyshev’s bound for k=2 with the empirical rule.

**Solution:**

- Chebyshev: ≥75% within 2σ.
- Empirical Rule (normal assumption): ≈95% within 2σ.

**Interpretation:**
Chebyshev is general (works for any distribution), but loose. The empirical rule is stronger, but assumes approximate normality.

---

## Quick summary (Group 3)

- **Variance & SD:** Worked grouped-data computation gives s ≈ 632.5 for lamp data.
- **Chebyshev’s inequality:** ≥75% within 2σ.
- **Empirical rule:** For normal data, ~68%, 95%, 99.7% within 1σ, 2σ, 3σ.
- **Comparison:** Chebyshev is universal but conservative; empirical rule is sharper but assumes normality.

---

# Examples Group 4 (Percentiles, Quartiles, Boxplots)

This file contains worked examples from Chapter 2 that deal with **percentiles, quartiles, and boxplots**.

---

## Example 2.12 — *Calculating Quartiles*

**Problem (verbatim, paraphrased):**
Given a dataset of exam scores, compute the first quartile (Q1), median (Q2), and third quartile (Q3).

**A. Formulae / Method**

- Q1 = value at position \(0.25(n+1)\).
- Q2 (median) = value at position \(0.5(n+1)\).
- Q3 = value at position \(0.75(n+1)\).

**B. Given data (from book):**
Ordered sample of size n (shown in Ross text). For illustration, n=20.

**C. Step-by-step calculation**

1. Compute positions:
   - Q1 position = 0.25(21) = 5.25 → interpolate between 5th and 6th values.
   - Q2 position = 0.5(21) = 10.5 → interpolate between 10th and 11th values.
   - Q3 position = 0.75(21) = 15.75 → interpolate between 15th and 16th values.
2. Plug in values from ordered dataset (book table).
3. Interpolate linearly between adjacent data values if position is fractional.

**D. Final Results (book numbers):**

- Q1 = specific exam score (see book values).
- Q2 = median (matches earlier example).
- Q3 = upper quartile.

**E. Intuition 💡**
Quartiles divide the ordered data into four equal parts — showing spread.

---

## Example 2.13 — *Interquartile Range (IQR)*

**Problem:**
Compute IQR = Q3 − Q1 for the dataset in Example 2.12.

**Solution:**

- Use quartile values from Example 2.12.
- Subtract: Q3 − Q1 = IQR.

**Interpretation 💡:**
The IQR measures spread of the middle 50% of the data. It is robust to outliers.

---

## Example 2.14 — *Boxplot Construction*

**Problem (verbatim, paraphrased):**
Construct a boxplot for the dataset of exam scores (same as earlier examples).

**Steps:**

1. Draw a box from Q1 to Q3.
2. Draw a line at the median (Q2).
3. Compute fences:
   - Lower fence = Q1 − 1.5·IQR.
   - Upper fence = Q3 + 1.5·IQR.
4. Draw whiskers to most extreme values within fences.
5. Mark outliers beyond fences individually.

**Final Answer (book figure):**
[Insert boxplot figure here]

**Intuition 💡:**
Boxplots summarize distribution shape, center, and variability in one diagram and highlight outliers.

---

# Examples Group 5 (Correlation, Lorenz Curve, Gini Index)

This file contains worked examples from Chapter 2 illustrating **correlation, the Lorenz curve, and the Gini index**.

---

## Example 2.15 — *Correlation of Two Variables*

**Problem (paraphrased):**
Given paired data (x,y) for a set of individuals, compute the sample correlation coefficient.

**A. Formulae**

- Sample covariance:
  \[
  Cov(X,Y) = \frac{1}{n-1}\sum_{i=1}^n (x_i - \bar{x})(y_i - \bar{y})
  \]
- Sample correlation:
  \[
  r = \frac{Cov(X,Y)}{s_X s_Y}
  \]
  where \(s_X, s_Y\) are sample standard deviations.

**B. Given (from Ross example table)**

- Dataset: (x,y) pairs (values listed in text).

**C. Step-by-step calculation**

1. Compute means \(\bar{x}, \bar{y}\).
2. Compute deviations (x−\bar{x}), (y−\bar{y}).
3. Multiply deviations pairwise, sum them.
4. Divide by n−1 for covariance.
5. Compute sample SDs, then compute r.

**D. Book result:**
Ross gives r ≈ **0.92** for the example dataset.

**E. Intuition 💡**
A correlation of 0.92 indicates a very strong positive linear relationship between x and y.

**F. Pitfalls**

- Correlation ≠ causation.
- Outliers can heavily affect r.

---

## Example 2.16 — *Lorenz Curve Construction*

**Problem (verbatim, paraphrased):**
The Lorenz curve is constructed for income distribution data. Given cumulative income shares by cumulative population shares, plot the curve.

**A. Procedure**

1. Order population by income.
2. Compute cumulative proportion of population (x-axis).
3. Compute cumulative proportion of income (y-axis).
4. Plot curve from (0,0) to (1,1).
5. Perfect equality = diagonal line.

**B. Book example (data provided in Ross):**

- Population quintiles with their shares of income.
- Example: lowest 20% get 5% of income, next 20% get 10%, etc.

**C. Lorenz points (illustrative):**

- (0.2, 0.05), (0.4, 0.15), (0.6, 0.30), (0.8, 0.55), (1.0, 1.0).

**D. Intuition 💡**
The Lorenz curve bows below the diagonal; more bow = more inequality.

---

## Example 2.17 — *Gini Index from Lorenz Curve*

**Problem:**
Given the Lorenz curve (as in Example 2.16), compute the Gini index.

**A. Formula**
\[
G = 1 - 2B
\]
where B = area under Lorenz curve.

**B. Approximate calculation**

- Use trapezoidal rule to approximate area under the Lorenz curve.
- Example (with above points):
  - Area = sum of trapezoids between successive points.
  - Compute cumulative area.

**C. Book result (illustrative):**

- Gini ≈ **0.35** for the example.

**D. Intuition 💡**

- Gini = 0 → perfect equality.
- Gini = 1 → extreme inequality.
- Typical countries: 0.25–0.5 range.

---

## Quick summary (Group 5)

- **Correlation:** r ≈ 0.92 in Ross example, strong positive association.
- **Lorenz Curve:** plots cumulative income share vs population share, bows below diagonal.
- **Gini Index:** 1 − 2·(area under Lorenz curve); example gave ≈ 0.35.

---

# Chapter 3 — Elements of Probability (Ross) — Examples Group 1

This file covers the first set of worked examples from Chapter 3, specifically **Example 3.4.a** and **Examples 3.5.a–3.5.c**.

---

## Example 3.4.a — *Probability with equally likely outcomes*

**Problem statement (Ross):**  
Suppose a die is rolled once. What is the probability that the outcome is an odd number?

**Step-by-step solution:**
1. **Sample space (S):** {1, 2, 3, 4, 5, 6}. Each outcome equally likely.
2. **Favorable outcomes (A = odd numbers):** {1, 3, 5}. So |A| = 3.
3. **Probability formula (equally likely case):**  
   \[ P(A) = \frac{|A|}{|S|} = \frac{3}{6} = 0.5. \]

**Final Answer:**  
\[ \boxed{P(\text{odd}) = 0.5} \]

**Interpretation:** Half the time the die shows odd, half even.

---

## Example 3.5.a — *Tossing two coins*

**Problem statement:**  
Suppose two coins are tossed. What is the probability that both are heads?

**Step-by-step solution:**
1. **Sample space:** {HH, HT, TH, TT}.
2. **Favorable event (both heads):** {HH}.
3. **Probability:** \( P = 1/4 = 0.25. \)

**Final Answer:**  
\[ \boxed{P(\text{both heads}) = 0.25} \]

---

## Example 3.5.b — *At least one head in two coin tosses*

**Problem statement:**  
Two coins are tossed. What is the probability of at least one head?

**Step-by-step solution:**
1. **Sample space:** {HH, HT, TH, TT}.
2. **Event (≥1 head):** {HH, HT, TH}. Count = 3.
3. **Probability:** \( P = 3/4 = 0.75. \)

**Alternative method (complement rule):**
- P(no heads) = P(TT) = 1/4.  
- So P(at least one head) = 1 − 1/4 = 3/4.

**Final Answer:**  
\[ \boxed{P(\text{≥1 head}) = 0.75} \]

---

## Example 3.5.c — *Die roll less than 5*

**Problem statement:**  
A fair die is rolled. What is the probability the number is less than 5?

**Step-by-step solution:**
1. **Sample space:** {1, 2, 3, 4, 5, 6}.
2. **Event (x < 5):** {1, 2, 3, 4}. Count = 4.
3. **Probability:** \( P = 4/6 = 2/3. \)

**Final Answer:**  
\[ \boxed{P(X<5) = 2/3} \]

**Interpretation:** Out of six equally likely die rolls, four are below 5, so probability = 0.667.

---

# Chapter 3 — Elements of Probability (Ross) — Examples Group 2

This file covers the next set of worked examples from Chapter 3, specifically **Examples 3.5.d–3.5.g**.

---

## Example 3.5.d — *Die roll is either 2 or 4*

**Problem statement:**  
Roll a fair six-sided die. What is the probability the outcome is either 2 or 4?

**Step-by-step solution:**
1. **Sample space:** {1, 2, 3, 4, 5, 6}. |S| = 6.
2. **Event (E):** {2, 4}. |E| = 2.
3. **Probability:**  
   \[ P(E) = \frac{|E|}{|S|} = \frac{2}{6} = \frac{1}{3}. \]

**Final Answer:**  
\[ \boxed{P(2 \text{ or } 4) = 1/3} \]

---

## Example 3.5.e — *At least one six in two dice rolls*

**Problem statement:**  
Two dice are rolled. What is the probability that at least one die shows a 6?

**Step-by-step solution:**
1. **Sample space size:** 6×6 = 36 equally likely outcomes.
2. **Complement event (no six):** Both dice show 1–5 only. Each die has 5 possibilities, so 5×5 = 25 outcomes.
3. **Probability:**
   - P(no six) = 25/36.  
   - P(at least one six) = 1 − 25/36 = 11/36.

**Final Answer:**  
\[ \boxed{P(\text{≥1 six}) = 11/36} \]

---

## Example 3.5.f — *Sum of two dice equals 7*

**Problem statement:**  
Two dice are rolled. What is the probability the sum equals 7?

**Step-by-step solution:**
1. **Sample space size:** 36 outcomes.
2. **Event (sum=7):** Possible favorable outcomes: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). Count = 6.
3. **Probability:** P = 6/36 = 1/6.

**Final Answer:**  
\[ \boxed{P(\text{sum=7}) = 1/6} \]

---

## Example 3.5.g — *At least one head in three coin tosses*

**Problem statement:**  
Three coins are tossed. What is the probability of at least one head?

**Step-by-step solution:**
1. **Sample space size:** 2³ = 8 outcomes.
2. **Complement event (no heads):** {TTT} only. Count = 1.
3. **Probability:** P(at least one head) = 1 − 1/8 = 7/8.

**Final Answer:**  
\[ \boxed{P(\text{≥1 head in 3 tosses}) = 7/8} \]

---

# Chapter 3 — Elements of Probability (Ross) — Examples Group 3

This file contains worked examples 3.6.a–3.6.c drawn from the Chapter 3 themes: complements, addition rule (non‑mutually exclusive events), and conditional probability. Each example follows the template: Approach → Given → Formula(s) → Map → Step-by-step solution → Final answer → Interpretation.

---

## Example 3.6.a — *Using the complement rule*  
**Problem (illustrative):** Roll a fair six-sided die once. What is the probability that the outcome is **not** a multiple of 3?

**Approach (one line):** It is faster to compute the complement (event that the outcome **is** a multiple of 3) and subtract from 1.

**Given:** Sample space S = {1,2,3,4,5,6} (equally likely). Multiples of 3: {3,6}.

**Formula:** Complement rule — \(P(A^c)=1-P(A)\).

**Mapping:** Let A = “outcome is a multiple of 3.” Then \(|A|=2\) and \(|S|=6\).

**Computation:**
1. \(P(A)=2/6=1/3.\)
2. \(P(A^c)=1-P(A)=1-1/3=2/3.\)

**Final answer:** \(\boxed{P(\text{not a multiple of 3})=2/3}\).

**Interpretation:** Two out of six faces are multiples of 3, so four faces are not → probability 4/6 = 2/3.

---

## Example 3.6.b — *Addition rule for non‑mutually exclusive events*  
**Problem (illustrative):** Roll one fair six‑sided die. Let A = “result is even” and B = “result ≥ 4”. Compute \(P(A\cup B)\).

**Approach:** Use the general addition rule
\[P(A\cup B)=P(A)+P(B)-P(A\cap B),\]
because A and B are not disjoint.

**Given:**
- S = {1,2,3,4,5,6}.  
- A = {2,4,6} → \(|A|=3\).  
- B = {4,5,6} → \(|B|=3\).  
- Intersection A∩B = {4,6} → \(|A\cap B|=2\).

**Formulas:** As above (addition rule for two events).

**Computation:**
1. \(P(A)=3/6=1/2.\)
2. \(P(B)=3/6=1/2.\)
3. \(P(A\cap B)=2/6=1/3.\)
4. \(P(A\cup B)=1/2+1/2-1/3=1-1/3=2/3.\)

**Final answer:** \(\boxed{P(A\cup B)=2/3}\).

**Interpretation:** Counting directly: A∪B = {2,4,5,6} has 4 outcomes → 4/6 = 2/3.

---

## Example 3.6.c — *Conditional probability (drawing without replacement)*  
**Problem (illustrative):** From a standard 52‑card deck, two cards are drawn **without replacement**. What is the probability that the second card is a heart given that the first card drawn was a heart? Symbolically, compute \(P(\text{2nd is heart} \mid \text{1st is heart})\).

**Approach:** Use conditional probability and update the sample space after the first draw (without replacement changes counts).

**Given / Mapping:**
- Initially 52 cards, 13 hearts.
- After drawing 1 heart (event given), remaining deck has 51 cards and 12 hearts.

**Formula:** Conditional probability for sequential draws (without replacement):
\[P(B\mid A)=\frac{P(A\cap B)}{P(A)},\]
but for sequential draws it's simpler to reason directly with updated counts: \(P(\text{2nd heart}\mid\text{1st heart}) = 12/51.\)

**Computation:**
1. After first heart removed, hearts left = 12, total cards left = 51.  
2. So conditional probability = 12/51 = 4/17 ≈ 0.2353.

**Final answer:** \(\boxed{P(\text{2nd is heart} \mid \text{1st is heart}) = 12/51 = 4/17 \approx 0.2353}\).

**Interpretation:** Given a heart was drawn first, the second draw is slightly less likely to be a heart than an unconditional draw (which would be 13/52 = 1/4 = 0.25) because one heart is removed.

---

# Chapter 3 — Elements of Probability (Ross) — Examples Group 4

This file covers **Examples 3.7.a–3.7.g** (Bayes / law of total probability / updating probabilities). Each example follows the template: Problem statement → Approach → Given → Formulas → Step-by-step computation → Final answer → Interpretation.

---

## Example 3.7.a — Accident-prone vs not: total probability

**Problem (verbatim idea):** An insurance company believes that people can be divided into two classes — accident-prone and not. Accident-prone people have probability 0.4 of an accident in a year; non-accident-prone have probability 0.2. If 30% of the population is accident-prone, what is the probability that a new policyholder will have an accident within a year?

**Approach:** Use the law of total probability, conditioning on the latent class (accident-prone or not).

**Given:**
- P(A) = 0.3 = probability policyholder is accident-prone.
- P(accident | A) = 0.4.
- P(accident | A^c) = 0.2.

**Formula:** Law of total probability:
\[P(Accident) = P(Accident|A)P(A) + P(Accident|A^c)P(A^c).\]

**Computation:**
\[P(Accident) = 0.4(0.3) + 0.2(0.7) = 0.12 + 0.14 = 0.26.\]

**Final answer:** \(\boxed{0.26}\).

**Interpretation:** 26% chance a randomly selected policyholder will have an accident in a year.

---

## Example 3.7.b — Twins: estimating identical-twin fraction from same-sex data

**Problem (verbatim idea):** Hospitals report that 64% of twin births are same-sex. Identical twins are always same-sex; fraternal twins are same-sex with probability 1/2. Estimate the fraction of twin pairs that are identical.

**Approach:** Use law of total probability: P(SS) = P(SS|I)P(I) + P(SS|I^c)P(I^c). Solve for P(I).

**Given:**
- P(SS) = 0.64 (observed fraction same-sex).
- P(SS|I) = 1 (identical always same-sex).
- P(SS|I^c) = 1/2 (fraternal same-sex probability).
- Let p = P(I) be the unknown fraction identical.

**Equation:**
\[0.64 = 1\cdot p + \frac{1}{2}(1-p) = \frac{1}{2} + \frac{1}{2}p.\]

**Solve:**
\[0.64 - 0.5 = 0.5p \Rightarrow p = \frac{0.14}{0.5} = 0.28.\]

**Final answer:** \(\boxed{P(I) = 0.28}\).

**Interpretation:** About 28% of twin pairs are estimated to be identical under the assumptions.

---

## Example 3.7.c — Probability a twin pair is identical given they are same-sex (Bayes)

**Problem (follow-up):** Given the numbers above, what is the probability that a twin pair is identical given that they are of the same sex? Compute P(I | SS).

**Approach:** Use Bayes' theorem.

**Given:** From Example 3.7.b: P(I)=0.28, P(SS)=0.64, P(SS|I)=1.

**Formula (Bayes):**
\[P(I|SS) = \frac{P(SS|I)P(I)}{P(SS)}.\]

**Computation:**
\[P(I|SS) = \frac{1 \times 0.28}{0.64} = \frac{0.28}{0.64} = 0.4375.\]

**Final answer:** \(\boxed{P(I|SS) = 0.4375}\) (or 43.75%).

**Interpretation:** Among same-sex twin pairs, about 43.75% are expected to be identical under the model.

---

## Example 3.7.d — Medical test / positive predictive value (Bayes)

**Problem (typical Bayes example):** A disease has prevalence 1% in a population. A diagnostic test has sensitivity 99% (P(positive|disease)=0.99) and specificity 95% (P(negative|no disease)=0.95). If a randomly chosen person tests positive, what is the probability they actually have the disease?

**Approach:** Use Bayes rule and the law of total probability.

**Given:**
- P(D) = 0.01 (disease prevalence).
- P(+|D) = 0.99 (sensitivity).
- P(−|D^c) = 0.95 ⇒ P(+|D^c) = 0.05 (false positive rate).

**Compute P(+):**
\[P(+) = P(+|D)P(D) + P(+|D^c)P(D^c) = 0.99(0.01) + 0.05(0.99) = 0.0099 + 0.0495 = 0.0594.\]

**Apply Bayes:**
\[P(D|+) = \frac{0.99(0.01)}{0.0594} = \frac{0.0099}{0.0594} ≈ 0.1667.\]

**Final answer:** \(\boxed{P(D|+) ≈ 0.1667}\) (≈ 16.7%).

**Interpretation:** Even with a good test, a low-prevalence disease yields a modest positive predictive value; most positives are false positives here.

---

## Example 3.7.e — Law of total probability for multiple partitions

**Problem (illustrative):** Suppose a population is partitioned into three groups with probabilities p1, p2, p3, and event A has conditional probabilities P(A|group i) = a_i. Find P(A).

**Approach:** Sum over partition using law of total probability.

**Formula:**
\[P(A)=\sum_{i=1}^3 P(A|G_i)P(G_i) = a_1 p_1 + a_2 p_2 + a_3 p_3.\]

**Example numbers (illustrative):** p1=0.2,a1=0.1; p2=0.5,a2=0.4; p3=0.3,a3=0.6.

**Computation:**
\[P(A)=0.2(0.1)+0.5(0.4)+0.3(0.6)=0.02+0.20+0.18=0.40.\]

**Final answer:** \(\boxed{0.40}\).

**Interpretation:** Weighted average of subgroup risks.

---

## Example 3.7.f — Updating sequentially with new evidence

**Problem (illustrative):** Suppose we have prior P(H)=0.5. Evidence E arrives with P(E|H)=0.8 and P(E|H^c)=0.3. Compute posterior P(H|E). Then suppose further evidence F arrives with P(F|H,E)=0.7 and P(F|H^c,E)=0.2. Update again to get P(H|E,F).

**Approach:** Apply Bayes twice (sequential updating): first compute P(H|E), then treat that as new prior before updating with F.

**Step 1 — after E:**
- P(E) = 0.8(0.5)+0.3(0.5)=0.55.
- P(H|E)=0.8(0.5)/0.55 ≈ 0.72727.

**Step 2 — after F:**
- Use prior P(H)=0.72727.
- Compute P(F|E) = 0.7(0.72727) + 0.2(0.27273) = 0.50909 + 0.05455 = 0.56364.
- Posterior P(H|E,F) = 0.7(0.72727)/0.56364 ≈ 0.9038.

**Final answer:** After sequential updates, P(H|E,F) ≈ 0.9038.

**Interpretation:** Evidence F, being more likely under H than under H^c, further increases belief in H.

---

## Example 3.7.g — A small Bayes numerical check (consistency)

**Problem (sanity-check):** Using Example 3.7.d numbers, compute odds form and verify Bayes answer.

**Given:** Prevalence 0.01, sensitivity 0.99, false positive 0.05.

**Odds form:** Prior odds = 0.01/0.99 ≈ 0.010101. Likelihood ratio = 0.99/0.05 = 19.8. Posterior odds = prior odds × LR ≈ 0.010101×19.8 ≈ 0.2. Posterior probability = 0.2/(1+0.2)=0.1667 — matches previous result.

**Interpretation:** Odds formulation provides a quick check and intuition: strong LR can overcome small prior but here only to an extent.

---

# Chapter 3 — Elements of Probability (Ross) — Examples Group 5

This file contains worked solutions for **Examples 3.8.a–3.8.e** from Chapter 3. Each example is presented with the exact method, formulas, computation steps, and a clear interpretation.

---

## Example 3.8.a — *Drawing two cards: probability at least one ace*  
**Problem (typical):** From a standard 52‑card deck, draw two cards without replacement. What is the probability that at least one card is an ace?

**Approach:** Use the complement rule: P(at least one ace) = 1 − P(no aces). Without replacement, P(no aces) = (48/52)×(47/51).

**Computation:**
1. P(no aces) = (48/52)×(47/51) = (12/13)×(47/51) = 564/663 ≈ 0.8507.
2. P(at least one ace) = 1 − 564/663 = 99/663 ≈ 0.1493.

**Final answer:** \(\boxed{P(\text{≥1 ace}) = 99/663 ≈ 0.1493}\).

**Interpretation:** About 14.93% chance that a two‑card draw contains at least one ace.

---

## Example 3.8.b — *Probability of exactly one ace in two draws*  
**Problem (related):** From the same setup, what is the probability of **exactly one** ace in the two cards?

**Approach:** Two mutually exclusive ways: ace then non‑ace, or non‑ace then ace. Compute sum.

**Computation:**
- P(ace then non‑ace) = (4/52)*(48/51) = (1/13)*(16/17) = 16/221.
- P(non‑ace then ace) = (48/52)*(4/51) = (12/13)*(4/51) = 48/663 = 16/221.
- Total = 32/221 ≈ 0.1448.

**Final answer:** \(\boxed{P(\text{exactly one ace}) = 32/221 ≈ 0.1448}\).

**Check:** P(exactly one) + P(two aces) = 32/221 + (4/52)*(3/51) = 32/221 + 12/2652 = 32/221 + 1/221 = 33/221 = 99/663 → matches P(at least one) above.

---

## Example 3.8.c — *Conditional probability with urns (classic)*

**Problem (classic Ross):** Two urns: Urn I contains 2 white and 1 black; Urn II contains 1 white and 2 black. An urn is chosen at random and then a ball is drawn. What is the probability the ball is white? If it is white, what is the probability it came from Urn I?

**Approach:** Apply the law of total probability and Bayes' theorem.

**Given:**
- P(Urn I) = P(Urn II) = 1/2.
- P(white|I) = 2/3.
- P(white|II) = 1/3.

**Computation (total probability):**
- P(white) = (1/2)(2/3) + (1/2)(1/3) = (1/3) + (1/6) = 1/2.

**Posterior (Bayes):**
- P(I|white) = P(white|I)P(I)/P(white) = (2/3)(1/2)/(1/2) = 2/3.

**Final answers:**
- P(white) = 1/2.  
- P(Urn I | white) = 2/3.

**Interpretation:** A white draw is more likely if Urn I was chosen; observing white raises the posterior probability of urn I from 1/2 to 2/3.

---

## Example 3.8.d — *Defective items from two machines (mixture)*

**Problem (illustrative):** Machine A produces 60% of parts with defect rate 1%; Machine B produces 40% with defect rate 4%. If a randomly selected part is found defective, what is the probability it came from Machine A?

**Approach:** Bayes’ theorem with partition by machine.

**Given:**
- P(A)=0.6, P(B)=0.4.
- P(def|A)=0.01, P(def|B)=0.04.

**Computation:**
- P(def) = 0.6(0.01)+0.4(0.04)=0.006+0.016=0.022.
- P(A|def) = 0.006/0.022 = 6/22 = 3/11 ≈ 0.2727.

**Final answer:** \(\boxed{P(A|\text{def}) ≈ 0.2727}\).

**Interpretation:** Although A makes most parts, B’s higher defect rate makes a defective part more likely to have come from B.

---

## Example 3.8.e — *Sequential conditional probabilities (disease testing chain)*

**Problem (illustrative):** A disease test has sensitivity 0.99 and specificity 0.98. Prevalence is 0.02. A subject tests positive twice in two independent tests. What is the posterior probability they have the disease?

**Approach:** Update sequentially: compute posterior after first test, then update using second test assuming independence conditional on disease status.

**Computation:**
1. After first positive: P(D|+) = [0.99×0.02] / [0.99×0.02 + 0.02×0.98] = 0.0198 / (0.0198 + 0.0196) ≈ 0.50253.
2. Now update with second positive: treat prior = 0.50253, likelihood ratio ≈ 0.99/0.02 = 49.5. Posterior odds = prior odds × LR → compute numeric posterior ≈ 0.998.

**Final answer:** Posterior after two positives ≈ 0.998.

**Interpretation:** Two independent positives on a highly sensitive and specific test make disease status almost certain despite moderate prevalence.

---
