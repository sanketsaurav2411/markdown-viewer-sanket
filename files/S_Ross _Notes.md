# 📘 Week 1 – Final Master Notes (Statistics & Foundations of Machine Learning)

---

## 🌟 Introduction
- **Statistics** = *Art of learning from data*.
- **Scope**:
  - **Descriptive Statistics** → Summarize observed data.
  - **Inferential Statistics** → Generalize from sample → population.
- **Flow in ML/AI**:
  Data → Descriptions → Probability models → Inference → Hypothesis testing → Regression → Machine Learning.
- **Applications**: Engineering, Medicine, Economics, Sports, Business, Government, AI.
- **History**: 
  - Origin in Renaissance Europe (state → statistics).
  - John Graunt (1662): mortality tables.
  - Edmund Halley (1693): life insurance models.
  - Fisher, Pearson, Gosset (*t-test*): modern inference.

**Intuition 💡:** Statistics is a **toolbox**: Descriptive = *story of what we see*; Inferential = *educated guess about what we can’t see*.

---

## 1. 📊 Types of Statistics

| Aspect            | **Descriptive Statistics**                 | **Inferential Statistics**                              |
| ----------------- | ------------------------------------------ | ------------------------------------------------------- |
| **Purpose**       | Summarize and describe existing data       | Use sample to infer about population                    |
| **Methods**       | Graphs, tables, mean, median, variance     | Estimation, Hypothesis testing, Confidence intervals    |
| **Data**          | Stand-alone                                | Generalized                                             |
| **Example**       | Average rainfall in India in 2024          | Predicting voter preference from 1000 respondents       |

👉 **Flow**: Collect Data → Descriptive → Inferential.

**Intuition 💡:** Descriptive = **snapshot**. Inferential = **prediction beyond data**.

---

## 2. 🏛️ Population vs Sample

- **Population**: Entire set (e.g., all IIT Bombay students).
- **Sample**: Subset chosen for study.
- **Representativeness**: Avoid bias; cover all subgroups.
- **Sampling Error**: Error due to sample ≠ population.
  $$ SE = \frac{\sigma}{\sqrt{n}} $$

**Example:** IITB height survey → 800 students (~10%) enough to estimate avg height of 8000.

---

## 3. 🔀 Sampling Methods

| Method             | Description                          | Example                              | Pros                  | Cons                               |
| ------------------ | ------------------------------------ | ------------------------------------ | --------------------- | ---------------------------------- |
| **Simple Random**  | Each member = equal chance           | Pick 100 students randomly           | Unbiased              | May miss subgroup balance          |
| **Systematic**     | Every k-th item                      | Every 10th product on line           | Easy to implement     | Risk of periodic bias              |
| **Stratified**     | Divide pop. into strata, sample each | IITB: 20% girls → sample reflects it | Good subgroup balance | Need subgroup info                 |
| **Cluster**        | Divide into groups, choose clusters  | Pick 2 hostels & survey all          | Efficient             | Clusters may not represent whole   |
| **Sequential**     | Collect until decision rule met       | Bulb factory defect check            | Saves cost/time       | Needs stopping criteria            |

**From Reference Notes (Topic 1 & 2)**:
- **Sampling Frame**: List of all units (roll numbers, Aadhaar, addresses).
- **Sampling Unit**: Element observed (household, patient, student).
- **Survey Steps**: Define objective → Identify population → Sampling scheme → Pilot → Data collection → Estimation → Reporting【40†source】【41†source】.

**Intuition 💡:** Stratified = *fair slices from each group*. Sequential = *stop once evidence is strong enough*.

---

## 4. 📦 Sample Size

- **Rule of thumb**: ~10% of population.
- **Trade-off**: Accuracy ↑ vs Cost/Time ↑.
- **Confidence Intervals**: Range where population parameter likely lies.
- **Sequential Sampling Example**:
  - Rule: Reject if >1% defective bulbs.
  - 750 defects in 1000 → Reject immediately.
  - 20 defects in 20,000 → Accept batch.

**Interpretation 🔎:** Mirrors **real-world decision-making**: stop when evidence is enough.

---

## 5. 🗂️ Data Types

```
Data Types
│
├── Categorical
│   ├── Nominal
│   └── Ordinal
│
└── Numerical
    ├── Interval
    └── Ratio
         ├── Discrete
         └── Continuous
```

### Categorical Data
- **Nominal**: Labels only, no order.
  - Examples: Gender, Hair color.
- **Ordinal**: Ordered categories.
  - Examples: Education level, Customer satisfaction.

### Numerical Data
- **Interval**: No true zero.
  - Examples: Temperature (°C).
- **Ratio**: True zero exists.
  - Examples: Age, Income.
- **Discrete**: Countable.
- **Continuous**: Measurable, infinite.

**From Reference Notes (Probability & Random Variables)**:
- **Qualitative vs Quantitative Variables**.
- **Skewness**: Measure of asymmetry.
- **Kurtosis**: Peakedness (flat vs sharp distributions)【37†source】【38†source】.

---

## 6. 📊 Descriptive Statistics in Detail

### Graphical Tools
- **Bar Graphs**: Categorical.
- **Histograms**: Continuous, grouped.
- **Frequency Polygon**: Connect midpoints.
- **Pie Chart**: Circle slices.
- **Ogive**: Cumulative.
- **Stem & Leaf**: Keep raw values.

### Numerical Measures
1. **Central Tendency**:
   - Mean = average.
   - Median = middle.
   - Mode = most frequent.
   - **Comparison Table:**

| Measure | Robustness to Outliers | When Useful |
|---------|-------------------------|-------------|
| Mean    | Sensitive               | Total/average calculations |
| Median  | Robust                  | Skewed distributions (income) |
| Mode    | Very robust             | Categorical / most frequent values |

2. **Spread**:
   - Range = Max – Min.
   - Variance: $s^2 = \frac{\sum (x_i-\bar{x})^2}{n-1}$.
   - SD = √variance.
   - Chebyshev’s inequality: ≥ (1 – 1/k²) within k SD.
   - Empirical Rule (normal): 68%-95%-99.7%.

**Comparison: Chebyshev vs Empirical Rule**

| Rule | Applicability | Within 1 SD | Within 2 SD | Within 3 SD |
|------|---------------|-------------|-------------|-------------|
| Chebyshev | Any data | ≥ 0%        | ≥ 75%       | ≥ 89%       |
| Empirical | Normal only | ~68%       | ~95%        | ~99.7%      |

3. **Percentiles & Quartiles**:
   - Q1 (25%), Median (50%), Q3 (75%).
   - Boxplot shows spread & outliers.

4. **Correlation**:
   - Scatterplots show relation.
   - Pearson r (–1 ≤ r ≤ 1).
   - **Interpretation 🔎**: r ≠ causation.

5. **Lorenz Curve & Gini Index**:
   - Measure inequality.
   - Perfect equality → 45° line.
   - Gini = 0 (equal) → 1 (max inequality).

---

## 7. ⚡ Real-World Case Studies

- **Teaching Methods**: Compare two groups’ scores → infer method effectiveness.
- **IIT Bombay Height Survey**: Small sample → represent large population.
- **Bulb Factory (Sequential Sampling)**: Early accept/reject → saves cost.
- **Elections**: Poll design, sampling frames crucial.
- **Medical Trials**: Representativeness ensures validity.

---

## 8. 🔑 Key Insights
- Descriptive = summary, Inferential = generalization.
- Population unseen, Sample workable.
- Larger $n$ reduces sampling error, but doesn’t eliminate it.
- Data type decides valid statistical test.
- Sequential sampling mirrors **real-world decision-making**.
- Skewness & Kurtosis add shape info beyond mean/variance.

---

## 📐 Formula Box (Math Anchors)

**Population Mean:**
\[
\mu = \frac{1}{N}\sum_{i=1}^N X_i
\]

**Sample Mean:**
\[
\bar{x} = \frac{1}{n}\sum_{i=1}^n x_i
\]

**Population Variance:**
\[
\sigma^2 = \frac{1}{N}\sum_{i=1}^N (X_i - \mu)^2
\]

**Sample Variance:**
\[
s^2 = \frac{1}{n-1}\sum_{i=1}^n (x_i - \bar{x})^2
\]

**Standard Deviation:**
\[
s = \sqrt{s^2}
\]

**Chebyshev’s Inequality:**
\[
P(|X - \mu| \geq k\sigma) \leq \frac{1}{k^2}, \quad k>1
\]

**Empirical Rule (Normal data):**
- ~68% within $\mu \pm 1\sigma$
- ~95% within $\mu \pm 2\sigma$
- ~99.7% within $\mu \pm 3\sigma$

**Lorenz Curve:**
\[
L\!\left(\frac{j}{n}\right) = \frac{x_1+x_2+\dots+x_j}{x_1+x_2+\dots+x_n}
\]

**Gini Index:**
\[
G = 1 - 2B
\]

---

## 9. 🗂️ Summary of Week 1
- **Statistics** = Science of data.
- Two types: **Descriptive** (summarize) & **Inferential** (conclude).
- **Population vs Sample**: Representativeness crucial.
- **Sampling methods**: Random, Stratified, Cluster, Systematic, Sequential.
- **Sample size**: ~10% rule, balance accuracy vs cost.
- **Data types**: Nominal, Ordinal, Interval, Ratio.
- **Descriptive tools**: Graphs, Mean, Median, Mode, Variance, SD, Quartiles.
- **Shape tools**: Skewness, Kurtosis.
- **Inequality tools**: Lorenz Curve, Gini Index.
- **Key cases**: Teaching methods, IITB survey, Bulb factory.

---

## 🔄 Flowchart – Week 1 Concepts

```
                 ┌───────────────┐
                 │  Statistics   │
                 └───────┬───────┘
                         │
        ┌────────────────┴─────────────────┐
        │                                  │
┌───────┴────────┐                ┌────────┴─────────┐
│ Descriptive    │                │ Inferential      │
│ (Summarize)    │                │ (Generalize)     │
└───────┬────────┘                └────────┬─────────┘
        │                                  │
 Graphs, Charts,                   Sample → Population
 Mean, Median, Mode                Estimation, Hypothesis
 Variance, SD, Quartiles           Testing, Regression
────────────────────────────────────────────────────────
Population → Sample → Representativeness → Sampling Error
────────────────────────────────────────────────────────
Sampling Methods: Random, Stratified, Cluster, Sequential, Systematic
────────────────────────────────────────────────────────
Data Types: Nominal, Ordinal, Interval, Ratio → Discrete/Continuous
────────────────────────────────────────────────────────
Shape Measures: Skewness, Kurtosis
```

---

# 📘 Week 2 – Final Master Notes (Probability, Random Variables & Sampling Distributions)

---

## 🌟 Introduction
- Week 2 extends foundations into **probability, random variables, and sampling distributions**.
- This builds the bridge: **Descriptive Statistics → Probability → Inference**.
- Coverage:
  - Probability concepts, axioms, and rules.
  - Random variables (discrete & continuous).
  - Expectation, variance, covariance, correlation.
  - Central Limit Theorem (CLT).
  - Sampling distributions (Normal, t, χ², F).
  - Estimation (Point, Interval, MLE, Bayesian).

**Intuition 💡:** Week 1 told us *“what data says”*. Week 2 begins to answer *“how data behaves under uncertainty and repetition”*.

---

## 1. 🎲 Elements of Probability【77†source】

### Interpretations
- **Frequentist:** Probability = long-run relative frequency.
- **Subjective:** Probability = degree of belief.

**Key Insight:** No matter the interpretation, **the mathematical rules are identical**.

### Sample Space & Events
- **Sample Space (S):** All possible outcomes.
- **Event (E):** Subset of S.
- **Null event (∅):** No outcomes.

**Examples:**
- Toss 2 dice → \(S=\{(i,j) : i,j=1..6\}\).
- Event A: “Sum=7.”

### Event Operations
- Union: \(E∪F\) = either E or F occurs.
- Intersection: \(E∩F\) = both occur.
- Complement: \(E^c\) = event does not occur.
- DeMorgan’s Laws:
  - \((E∪F)^c = E^c∩F^c\)
  - \((E∩F)^c = E^c∪F^c\)

### Probability Axioms
1. \(0 ≤ P(E) ≤ 1\)
2. \(P(S)=1\)
3. If E and F disjoint: \(P(E∪F)=P(E)+P(F)\)

**Useful Results:**
- \(P(E^c)=1-P(E)\)
- \(P(E∪F)=P(E)+P(F)-P(EF)\)

### Conditional Probability
\[
P(E|F)=\frac{P(EF)}{P(F)},\quad P(F)>0
\]

Multiplication Rule:
\[
P(EF)=P(F)P(E|F)
\]

### Independence
- E, F independent if \(P(EF)=P(E)P(F)\).

### Bayes’ Theorem
\[
P(F_j|E)=\frac{P(E|F_j)P(F_j)}{\sum_i P(E|F_i)P(F_i)}
\]

**Intuition 💡:** Bayes = *Update belief with evidence*. Common in **diagnostics, spam filters, reliability tests**.

---

## 2. 🎲 Random Variables【76†source】【79†source】

### Definition
- **Random Variable (RV):** A function mapping outcomes → numbers.

### Types
- **Discrete (DRV):** Countable outcomes. → Probability Mass Function (PMF).
- **Continuous (CRV):** Interval values. → Probability Density Function (PDF).

### PMF
\[
p(x)=P(X=x), \quad \sum_x p(x)=1
\]

### PDF
\[
P(a<X≤b)=\int_a^b f(x)dx, \quad \int_{-∞}^{∞} f(x)dx=1
\]

### CDF
\[
F(x)=P(X≤x)
\]
- Non-decreasing, limits: 0→1.

### Expectation & Variance
- Discrete: \(E[X]=\sum xp(x)\).
- Continuous: \(E[X]=\int xf(x)dx\).
- Variance:
\[
Var(X)=E[(X-μ)^2]=E[X^2]-(E[X])^2
\]

### Indicator RV

\[
I_A =
\begin{cases}
1, & \text{if $A$ occurs} \\
0, & \text{otherwise}
\end{cases}
\]

- E[I_A]=P(A).

### Joint Distributions
- Discrete: \(p(x,y)=P(X=x,Y=y)\).
- Continuous: \(f(x,y)\).
- Marginals: \(f_X(x)=∫f(x,y)dy\).

### Covariance & Correlation
\[
Cov(X,Y)=E[(X-μ_X)(Y-μ_Y)]
\]
\[
ρ=\frac{Cov(X,Y)}{σ_Xσ_Y},\quad -1≤ρ≤1
\]

### Common Distributions
- **Bernoulli:** Success/failure.
- **Binomial:** #successes in n trials.
- **Poisson:** Rare event counts.
- **Uniform:** Equal chance interval.
- **Normal:** Bell curve.
- **Exponential:** Time between events.

**Comparison: DRV vs CRV**
| Aspect | DRV | CRV |
|--------|-----|-----|
| Values | Countable | Interval |
| Example | Dice, Binomial | Height, Normal |
| Probability at point | Possible | Always 0 |
| Representation | PMF | PDF |

**Intuition 💡:** RVs convert random outcomes into **manageable numeric models**.

---

## 3. 📐 Sampling Distributions【78†source】【80†source】

### Sample Mean
\[
\bar{X}=\frac{1}{n}\sum_{i=1}^n X_i
\]
- E[\bar{X}]=μ.
- Var(\bar{X})=σ²/n.

### Central Limit Theorem (CLT)
\[
\frac{\bar{X}-μ}{σ/√n} \approx N(0,1)
\]
- Explains universality of Normal.
- Rule: n≥30 sufficient.

### Sample Variance
\[
S²=\frac{∑(X_i-\bar{X})²}{n-1}
\]
- E[S²]=σ² (unbiased).

### From Normal Populations
- \(\bar{X}∼N(μ,σ²/n)\).
- (n–1)S²/σ² ∼ χ²(n–1).
- Independence of mean & variance → **t-distribution**:
\[
T=\frac{√n(\bar{X}-μ)}{S}∼t_{n-1}
\]

### Finite Population Case
- Hypergeometric: exact.
- Binomial approx valid if N≫n.

### Key Distribution Uses
| Distribution | Appears in | Use |
|--------------|------------|-----|
| Normal | CLT, large-sample | General inference |
| t | Mean, unknown σ, small n | CI, tests |
| χ² | Variances | Goodness of fit |
| F | Ratio of variances | ANOVA |

**Intuition 💡:** Sampling distributions explain **“what happens if I resample repeatedly.”**

---

## 4. 📏 Estimation【75†source】

### Point Estimation
- Example: \(\bar{X}\) estimates μ.
- Good estimator = **Unbiased, Consistent, Efficient, Sufficient**.

### Interval Estimation
General form:
\[
θ̂ ± (Critical×SE)
\]
- Mean, σ known: \(\bar{X}±Z_{α/2}σ/√n\).
- Mean, σ unknown: \(\bar{X}±t_{α/2,n-1}S/√n\).
- Proportion: \(p̂ ± Z_{α/2}√(p̂(1-p̂)/n)\).

### Maximum Likelihood Estimation (MLE)
\[
θ̂_{MLE}=argmax_θ L(θ)=argmax_θ∏f(x|θ)
\]

### Bayesian Estimation
\[
Posterior: π(θ|x)∝f(x|θ)π(θ)
\]
- Incorporates prior belief.
- Posterior mean/Posterior mode (MAP).

**Comparison: Point vs Interval vs Bayesian**
| Aspect | Point | Interval | Bayesian |
|--------|-------|----------|----------|
| Output | Single value | Range | Posterior distribution |
| Uncertainty | Not explicit | Explicit CI | Explicit via posterior |
| Approach | Frequentist | Frequentist | Bayesian |

**Intuition 💡:**
- Point = “best guess.”
- Interval = “safe margin.”
- Bayesian = “belief update.”

---

## 📐 Formula Box

**Probability**
- \(P(E^c)=1-P(E)\)
- \(P(E∪F)=P(E)+P(F)-P(EF)\)
- \(P(E|F)=P(EF)/P(F)\)
- Bayes: \(P(F_j|E)=P(E|F_j)P(F_j)/∑P(E|F_i)P(F_i)\)

**Random Variables**
- E[X]=∑xp(x) or ∫xf(x)dx
- Var(X)=E[X²]-(E[X])²
- Cov(X,Y)=E[XY]-E[X]E[Y]
- Corr=Cov(X,Y)/(σ_Xσ_Y)

**Sampling**
- Mean: \(\bar{X}=∑X_i/n\)
- Var(\bar{X})=σ²/n
- Variance: \(S²=∑(X-\bar{X})²/(n-1)\)
- CLT: (\bar{X}-μ)/(σ/√n)→N(0,1)
- Normal sample: (n-1)S²/σ²∼χ², T=√n(\bar{X}-μ)/S∼t

**Estimation**
- CI: θ̂ ± (Critical×SE)
- MLE: θ̂=argmaxθ L(θ)
- Bayes: Posterior∝Likelihood×Prior

---

## 🔄 Flowchart: Probability to Inference
```
🎯 Experiment → Outcomes (Sample Space)
   ↓
📂 Define Events → Apply Axioms
   ↓
🎲 Random Variables → PMF/PDF/CDF
   ↓
📐 Expectation & Variance → Covariance, Correlation
   ↓
📊 Sampling → Mean & Variance
   ↓
🔄 CLT → Normal Approximation
   ↓
📊 Distributions: Normal, t, χ², F
   ↓
📏 Estimation → Point, Interval, MLE, Bayesian
   ↓
✅ Prepares for Hypothesis Testing
```

---

## 🗂️ Snapshot (Quick Revision)
- Probability = rules of uncertainty.
- RV = outcomes → numbers.
- DRV (PMF) vs CRV (PDF).
- Expectation=center, Variance=spread.
- CLT explains Normal’s universality.
- Sampling Distributions = Normal, t, χ², F.
- Estimation: Point, Interval, Bayesian.

---

# 📘 Week 3 – Final Master Notes (Random Variables, Sampling Distributions & Estimation)

---

## 🌟 Introduction
- Week 3 deepens probability foundations into **Random Variables, Expectations, Variance, Covariance, Sampling Distributions, and Estimation techniques**.
- We learn how **real-world outcomes → numerical models (RVs) → probability rules → statistical inference**.
- Main coverage:
  - Random Variables: Discrete & Continuous.
  - Probability Mass Function (PMF), Probability Density Function (PDF), Cumulative Distribution Function (CDF).
  - Expectation, Variance, Covariance, Correlation.
  - Joint Distributions & Conditional Distributions.
  - Central Limit Theorem (CLT).
  - Sampling Distributions: Normal, t, χ², F.
  - Estimation: Point, Interval, Ratio/Product Estimators.

**Intuition 💡:** Random Variables (RVs) are the **bridge** between uncertainty and mathematics. Sampling Distributions explain **“what happens if I sample repeatedly”**. Estimation tells us **“how to guess population truths from data.”**

---

## 1. 🎲 Random Variables【108†source】【110†source】

### Definition
- **Random Variable (RV):** Numerical outcome of a random experiment.
- Examples:
  - Toss 2 dice → RV = sum of dice.
  - Reservoir → RV = water level at season’s end.
  - Quality check → RV = # acceptable components.

### Types
- **Discrete (DRV):** Countable outcomes.
  - Defined by **Probability Mass Function (PMF):**
    \[
    p(x)=P(X=x), \quad \sum_x p(x)=1
    \]
  - Example: Dice sum ∈ {2,…,12}.

- **Continuous (CRV):** Interval values.
  - Defined by **Probability Density Function (PDF):**
    \[
    P(a<X≤b)=\int_a^b f(x)dx, \quad \int_{-∞}^{∞} f(x)dx=1
    \]
  - Example: Lifespan of a bulb.

- **Cumulative Distribution Function (CDF):**
  \[
  F(x)=P(X≤x)
  \]
  Properties: non-decreasing, F(–∞)=0, F(∞)=1.

### Indicator Variables
\[
I_A=\begin{cases}1,&A\text{ occurs}\\0,&\text{otherwise}\end{cases}
\]
- E[I_A]=P(A).

**Comparison Table: Discrete vs Continuous**
| Aspect | DRV | CRV |
|--------|-----|-----|
| Values | Countable | Interval |
| Representation | PMF | PDF |
| P(X=a) | Possible >0 | Always 0 |
| Example | Dice, Binomial | Height, Normal |

**Intuition 💡:** DRV = *count outcomes*. CRV = *measure outcomes*.

---

## 2. 📊 Expectation & Variance【108†source】【110†source】

### Expectation (Mean)
- Discrete:
  \[
  E[X]=\sum x p(x)
  \]
- Continuous:
  \[
  E[X]=\int x f(x) dx
  \]
- Properties: E[aX+b]=aE[X]+b.

### Variance (Spread)
\[
Var(X)=E[(X-μ)^2]=E[X^2]-(E[X])^2
\]
- Standard deviation = √Var(X).
- Properties:
  - Var(aX+b)=a²Var(X).
  - Var(X+Y)=Var(X)+Var(Y)+2Cov(X,Y).

### Covariance
\[
Cov(X,Y)=E[(X-μ_X)(Y-μ_Y)]=E[XY]-E[X]E[Y]
\]

### Correlation
\[
ρ=\frac{Cov(X,Y)}{σ_Xσ_Y},\quad -1≤ρ≤1
\]

**Interpretation 🔎:**
- E[X] = center of mass.
- Var(X) = spread around center.
- Cov/ρ = linear dependence.

---

## 3. 🔗 Joint & Conditional Distributions【108†source】【110†source】

### Joint Distributions
- Discrete: p(x,y)=P(X=x,Y=y).
- Continuous: f(x,y), with
  \[
  P((X,Y)∈A)=\iint_A f(x,y)dxdy
  \]

### Marginals
- Discrete: P(X=x)=∑_y p(x,y).
- Continuous: f_X(x)=∫ f(x,y)dy.

### Conditional
- Discrete:
  \[
  P(X=x|Y=y)=\frac{p(x,y)}{P(Y=y)}
  \]
- Continuous:
  \[
  f_{X|Y}(x|y)=\frac{f(x,y)}{f_Y(y)}
  \]

### Independence
- X and Y independent if p(x,y)=p_X(x)p_Y(y).

**Intuition 💡:** Joint = *whole picture*. Marginal = *one slice*. Conditional = *given info*. Independence = *no effect of one on other*.

---

## 4. 📐 Sampling Distributions【109†source】

### Sample Mean
\[
\bar{X}=\frac{1}{n}∑X_i,\quad E[\bar{X}]=μ,\ Var(\bar{X})=σ²/n
\]

### Sample Variance
\[
S²=\frac{∑(X_i-\bar{X})²}{n-1},\quad E[S²]=σ²
\]

### Central Limit Theorem (CLT)
\[
\frac{\bar{X}-μ}{σ/√n}∼N(0,1)\quad (n≥30)
\]
- Explains why Normal curve appears universally.
- Binomial approx Normal if np(1–p)≥10.

### From Normal Populations
- If X_i∼N(μ,σ²):
  - \(\bar{X}∼N(μ,σ²/n)\).
  - (n–1)S²/σ²∼χ²(n–1).
  - Independence → t-distribution:
    \[
    T=\frac{√n(\bar{X}-μ)}{S}∼t_{n-1}
    \]

### Finite Population Case
- Hypergeometric(N,Np,n).
- Approx → Binomial if N≫n.

**Key Distributions Comparison**
| Distribution | When | Shape | Uses |
|--------------|------|-------|------|
| Normal | CLT, population normal | Symmetric | General inference |
| t | Mean, small n, unknown σ | Heavier tails | CI, tests |
| χ² | Variances | Right-skewed | Tests of variance |
| F | Ratio of variances | Right-skewed | ANOVA, regression |

**Intuition 💡:** Sampling distributions answer *“What if I resample?”*.

---

## 5. 📏 Estimation【111†source】【112†source】

### Point Estimation
- Single value: θ̂.
- Example: \(\bar{X}\) estimates μ.
- Good estimator properties: **Unbiased, Consistent, Efficient, Sufficient**.

### Interval Estimation (CI)
- General form:
  \[
  θ̂ ± (Critical × SE)
  \]
- Mean (σ known): \(\bar{X}±Z_{α/2}σ/√n\).
- Mean (σ unknown): \(\bar{X}±t_{α/2,n-1}S/√n\).
- Proportion: \(p̂±Z_{α/2}√(p̂(1-p̂)/n)\).

### Ratio Estimation【112†source】
- Use auxiliary variable X (known mean).
- Estimator:
  \[
  \hat{Y}_R=\frac{\bar{y}}{\bar{x}}X
  \]
- Efficient if ρ>0.

### Product Estimation【112†source】
- For negative correlation.
- Estimator:
  \[
  \hat{Y}_P=\bar{y}\cdot\frac{\bar{X}}{\bar{x}}
  \]

**Comparison Table**
| Estimator | Works Best When | Bias | Efficiency |
|-----------|----------------|------|------------|
| Sample Mean | Baseline | Unbiased | – |
| Ratio | ρ>0 strong | Slight bias | More efficient |
| Product | ρ<0 | Slight bias | More efficient |

**Intuition 💡:** Estimation is like **guessing population truth**: point = single guess, interval = safety margin, ratio/product = smarter guess with extra info.

---

## 📐 Formula Box

**Random Variables**
- PMF: \(p(x)=P(X=x)\).
- PDF: \(P(a<X≤b)=∫_a^b f(x)dx\).
- CDF: \(F(x)=P(X≤x)\).
- E[X]=∑xp(x) (discrete), ∫xf(x)dx (continuous).
- Var(X)=E[X²]-(E[X])².
- Cov(X,Y)=E[XY]-E[X]E[Y].
- Corr=Cov(X,Y)/(σ_Xσ_Y).

**Sampling**
- Mean: \(\bar{X}=∑X_i/n\).
- Var(\bar{X})=σ²/n.
- Variance: \(S²=∑(X-\bar{X})²/(n-1)\).
- CLT: (\bar{X}-μ)/(σ/√n)→N(0,1).
- (n-1)S²/σ²∼χ², T=√n(\bar{X}-μ)/S∼t.

**Estimation**
- CI: θ̂ ± (Critical×SE).
- Ratio: \(\hat{Y}_R=(\bar{y}/\bar{x})X\).
- Product: \(\hat{Y}_P=\bar{y}(\bar{X}/\bar{x})\).

---

## 🔄 Flowchart – From RVs to Estimation
```
Experiment → Random Variable (X)
   ↓
PMF/PDF → Expectation, Variance
   ↓
Joint Distributions → Covariance, Correlation
   ↓
Samples → Sample Mean & Variance
   ↓
CLT → Normal Approximation
   ↓
Sampling Distributions → Normal, t, χ², F
   ↓
Estimation → Point, Interval, Ratio, Product
```

---

## 🗂️ Snapshot (Quick Revision)
- RV = outcome → number.
- DRV (PMF), CRV (PDF).
- Expectation=center, Variance=spread.
- Covariance & Correlation → dependence.
- CLT explains Normal’s universality.
- Sampling Distributions: Normal, t, χ², F.
- Estimation: Point, Interval, Ratio, Product.

---

# 📘 Week 5 – Final Master Notes (Probability, Conditional Probability, Bayes’ Theorem & Independence)

---

## 🌟 Introduction
- Week 5 emphasizes **probability theory as the foundation for inferential statistics and machine learning**.
- Main concepts:
  - Sample spaces & events.
  - Probability axioms & basic propositions.
  - Counting principles (permutations & combinations).
  - Conditional probability & Law of Total Probability.
  - Bayes’ theorem.
  - Independence of events.
- Reinforced via TA problems: dice, cards, medical tests, birthday paradox, and reliability systems.

**Intuition 💡:** Probability = *consistent rules for uncertainty*. It enables reasoning from partial knowledge to conclusions.

---

## 1. 🎲 Sample Space & Events

### Definitions
- **Sample Space (S):** All possible outcomes.
- **Event (E):** Subset of S.
- **Null Event (∅):** Impossible outcome.
- **Certain Event (S):** Always occurs.

**Examples:**
- Toss a coin → S={H,T}.
- Roll a die → S={1,2,3,4,5,6}.
- Gender → S={Boy,Girl}.

### Event Operations
- Union: \(E∪F\) → either E or F.
- Intersection: \(E∩F\) → both occur.
- Complement: \(E^c\) → E does not occur.
- Subset: \(E⊂F\).

**DeMorgan’s Laws:**
- \((E∪F)^c=E^c∩F^c\).
- \((E∩F)^c=E^c∪F^c\).

---

## 2. 📐 Axioms of Probability (Kolmogorov)
1. \(0≤P(E)≤1\).
2. \(P(S)=1\).
3. If \(E_1,E_2,…\) are mutually exclusive:
\[
P\Big(\bigcup_i E_i\Big)=\sum_i P(E_i).
\]

### Propositions
- \(P(E^c)=1−P(E)\).
- \(P(E∪F)=P(E)+P(F)−P(E∩F)\).
- If \(E⊂F\), then P(E)≤P(F).

**Example (Smoking in Nevada):**
- 28% men smoke cigarettes, 6% cigars, 3% both.
- P(smoke either) = 0.28+0.06−0.03=0.31.
- P(neither)=0.69.

### Odds
\[
\text{Odds}(A)=\frac{P(A)}{1-P(A)}
\]
- Example: If P(A)=3/4 → Odds=3:1.

---

## 3. ⚖️ Equally Likely Outcomes (Classical)
\[
P(E)=\frac{\#\text{favourable outcomes}}{\#\text{total outcomes}}
\]

**Examples:**
- Die roll → P(even)=3/6=0.5.
- Bowl: 6 white, 5 black → choose 2 without replacement. Total=\(\binom{11}{2}=55\). Favourable=30. Probability=30/55=6/11.
- Birthday paradox: With 23 people, probability ≥2 share a birthday >0.5.

---

## 4. 🧮 Counting Principles
- **Multiplication Principle:** m outcomes × n outcomes → m·n total.
- **Permutations:**
\[
^nP_r=\frac{n!}{(n-r)!}
\]
- **Combinations:**
\[
^nC_r=\binom{n}{r}=\frac{n!}{(n-r)!r!}
\]

**Examples:** Books arrangement, committees, roommates pairing.

---

## 5. 🎯 Conditional Probability
\[
P(E|F)=\frac{P(E∩F)}{P(F)},\quad P(F)>0.
\]

**Examples:**
- Dice: Given first die=3, P(sum=8)=1/6.
- Transistors: Given not defective, P(acceptable)=25/35=5/7.
- Father-son dinner: P(both boys | at least one boy)=1/3.

**Intuition 💡:** Conditional = *updating probability when information is known*.

---

## 6. 📊 Law of Total Probability
If {F₁,…,Fₙ} partition S:
\[
P(E)=\sum_{i=1}^n P(E|F_i)P(F_i).
\]

**Example (Insurance):**
- Accident prone (30%): P(accident)=0.4.
- Not accident prone (70%): P(accident)=0.2.
- Overall: 0.4·0.3+0.2·0.7=0.26.

---

## 7. 🧾 Bayes’ Theorem
\[
P(F_j|E)=\frac{P(E|F_j)P(F_j)}{\sum_i P(E|F_i)P(F_i)}.
\]

### Examples
- **Medical Test:** Sensitivity=0.99, Specificity=0.99, Prevalence=0.005.
\[
P(D|+) = \frac{0.99·0.005}{0.99·0.005+0.01·0.995}=0.332.
\]
- **Twins problem:** P(identical|same sex)≈0.28.
- **Criminal case:** Prior guilt=0.6, given rare evidence → Posterior≈0.88.

**Intuition 💡:** Bayes = *prior belief updated by evidence*.

---

## 8. 🔗 Independence
\[
P(E∩F)=P(E)P(F).
\]

**Properties:**
- Symmetric.
- E ⫫ F ⇒ E ⫫ Fᶜ.

**Examples:**
- Cards: A=Ace, H=Heart → Independent.
- Dice: Sum=7 independent of first die=4.
- Reliability (parallel system):
\[
P(\text{system works})=1-\prod_i (1-p_i).
\]

---

## 9. 📘 Random Variables (Lecture6 content)
- **DRV:** PMF p(x)=P(X=x).
- **CRV:** PDF f(x), with ∫ f(x)dx=1.
- **CDF:** F(x)=P(X≤x).
- **Indicator RV:** I_A=1 if A occurs, else 0.
- **Joint Distributions:** F(x,y)=P(X≤x,Y≤y). Independence if f(x,y)=f_X(x)f_Y(y).

---

## 10. 📘 TA Problems & Solutions
- Dice, card, committees, birthday paradox.
- Medical test Bayes example.
- Reliability parallel system formula.
- Explicit combinatorics (\(\binom{n}{r}\)) shown.

---

## 📐 Formula Box
- Conditional: \(P(E|F)=P(E∩F)/P(F)\).
- Total Probability: \(P(E)=\sum P(E|F_i)P(F_i)\).
- Bayes: \(P(F_j|E)=\frac{P(E|F_j)P(F_j)}{\sum P(E|F_i)P(F_i)}\).
- Reliability (parallel): \(P(\text{system})=1-\prod (1-p_i)\).

---

## 📊 Comparison Table: Conditional vs Independence
| Aspect | Conditional | Independent |
|--------|-------------|-------------|
| Formula | P(E|F)=P(E∩F)/P(F) | P(E∩F)=P(E)P(F) |
| Info needed | Given F | None |
| Interpretation | Updated prob with info | No effect between events |

---

## 🔄 Flowchart – Probability Concepts
```
Sample Space → Events → Set Operations
   ↓
Axioms of Probability
   ↓
Equally Likely Outcomes → Counting Principles
   ↓
Conditional Probability
   ↓
Law of Total Probability
   ↓
Bayes’ Theorem
   ↓
Independence
   ↓
Applications: Dice, Cards, Medical Tests, Reliability
```

---

## 🗂️ Snapshot (Quick Revision)
- Sample space, events, axioms.
- Equally likely → ratio rule.
- Counting → permutations, combinations.
- Conditional → info-based update.
- Total Probability → weighted sum.
- Bayes → belief update.
- Independence → no effect.
- Random Variables: PMF, PDF, CDF, Joint.

---
