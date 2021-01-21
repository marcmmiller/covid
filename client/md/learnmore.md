<div class="tile-header">ABOUT RISK ASSESSMENT</div>
<div class="tile-body">

Covid prevalence reporting frequently focuses on stats like positive test
results, or test positivity rates.  These numbers have limited utility when
considered in the abstract: Are 300 positive tests "a lot"?  Does a test
positivity rate of 5% mean that I should avoid the supermarket?  In order to
answer these questions, we often need to take other factors into account: How
closely does the available data match the actual situation?  What is the
population of my area?  How do multiple independent risk factors combine to form
a composite picture?

The risk assessment here attempts to present the available data in a form that
is more readily consumed for decision making.  It tries to answer questions
like: How many people in my community have active Covid?  What is my likelihood
of encountering someone with active Covid in public?

##### Underreporting Factor

To assess risk of exposure to Covid-19 in public places, we need to estimate the
actual prevalence of the disease in the community.  This is tricky because the
data available only tells us the number of people who have received a positive
test result.  Since there are many scenarios where an individual might not seek
a Covid test -- for example a person's case is asymptomatic -- it's widely
believed (and evidenced by seroprevalance studies) that positive test results
greatly undercount actual positive Covid cases.  Therefore we use a multiplier
to estimate _actual_ positive cases from positive test results.  This
coefficient is sometimes called the _ascertainment bias_ or _underreporting
factor_.  There exist a variety of methodologies for determining this factor, so
a number of different values exist and have been used, and they range widely.
It has also likely evolved over time, as testing has become more widespread and
easily accessible to Americans.

We currently use an underreporting factor of `3.2`, which is based on results
from [this paper][1] from the Journal of the American Medical Association.  The
results are themselves based on CDC seroprevalance survey data throughout the
pandemic as it has evolved.  In the future, we may add a feature which allows
the user to experiment with their own custom factor.

[1]: http://yahoo.com


##### Active Cases

In addition to knowing how many people have tested positive for Covid-19, we
factor in how long a case is "active" for.  Individuals who are no longer
contagious and have long since recovered should not be considered in a risk
assessment.  For these purposes we use the admittedly conservative number of
`20` days.  Thus, when a county reports a new positive test result, we consider
it an active case for the following 20 days.  The CDC sites [a range of 10-20
days][2] for infectiousness depending on the severity of the case and the
infected person's level of immnocompromise.  Since we don't have a number that
is more definite and more solidly supported by resarch, we have selected to use
the number at the top of the range.  This also produces numbers that more
closely match what other county-level sites are reporting for active cases.

[2]: https://www.cdc.gov/coronavirus/2019-ncov/hcp/duration-isolation.html#:~:text=Available%20data%20indicate%20that%20persons,20%20days%20after%20symptom%20onset


##### Population Estimates

The US Census Bureau provides population estimates for 2019 based on the 2010
census, which are used for the calculations hosted here.


</div>
