
A lot of Covid reporting focuses on stats like positive test results, or test
positivity rates.  These numbers have limited utility when considered in the
abstract: Are 300 positive tests a lot?  Does a test positivity rate of 5% mean
that I should avoid the supermarket?  In order to answer these questions, we
often need to take other factors into account: How closely does the available
data match the actual situation?  What is the population of my area?  How do
multiple independent risk factors combine to form a composite picture?

The risk assessment here attempts to present the available data in a form that
is more readily consumed for decision making.  How many people in my community
have active covid?  What is my likelihood of encountering someone with active
covid in public?

##### Underreporting Factor

To assess risk of exposure to Covid-19 in public places, we need to estimate the
actual prevalance of the disease in the community.  This is tricky because the
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
need to know how long a case is "active" for.  Individuals who are no longer
contagious and have long since recovered should not be considered in a risk
assessment.

##### Population Estimates

Praesent id ante purus. Ut finibus, nulla ac volutpat commodo, justo odio
iaculis metus, ac luctus est risus aliquam tellus. Nunc viverra sapien eros,
fringilla cursus libero scelerisque ac. Pellentesque ultrices lectus eget cursus
pellentesque. Vivamus quis elit ut neque ornare pretium. In hac habitasse platea
dictumst. Duis interdum lorem vitae nisl efficitur, vitae pharetra diam
convallis. Vivamus risus dolor, ultricies non malesuada vel, posuere imperdiet
sapien. Ut venenatis, dui sed bibendum gravida, nunc tortor finibus lectus, vel
pulvinar eros ex ut nibh. Phasellus sollicitudin ipsum aliquet erat ullamcorper,
in commodo urna pellentesque. Praesent eu augue purus. Phasellus eu leo quis
purus facilisis hendrerit. Vivamus orci nibh, facilisis vitae dignissim nec,
congue pellentesque tellus. Proin ut orci pellentesque, ultrices leo vel,
fermentum sapien. Donec vulputate tincidunt dignissim. Nulla commodo orci ut
lacus venenatis, sed fringilla arcu cursus.


##### What about test positivity rate?

Donec risus est, vulputate sed lorem bibendum, egestas porttitor massa. Aliquam
dui nunc, varius sed scelerisque quis, posuere vitae diam. Sed semper orci at
pharetra facilisis. Ut porta varius nunc. Integer odio magna, viverra ut
ullamcorper eget, consequat vel lorem. Quisque nunc nibh, vehicula vel lacus eu,
fringilla auctor nisl. Morbi venenatis dapibus nisi et pharetra. Nunc egestas
felis sit amet pellentesque vestibulum. Nullam quam sapien, accumsan vel
consequat quis, ornare id lacus.

Nulla ac mauris ac augue euismod varius id id nulla. Nam faucibus et metus sit
amet sagittis. Aliquam non viverra metus, non dapibus tortor. In hac habitasse
platea dictumst. Ut imperdiet, sem vitae ultrices ultrices, urna lacus
sollicitudin magna, a semper lacus justo non ex. Curabitur rutrum velit interdum
rhoncus ornare. Aliquam semper, est vel molestie viverra, tortor sapien sodales
leo, tincidunt blandit augue velit sit amet nunc. In venenatis vitae est vitae
sagittis. Nam sodales faucibus nibh in finibus. Vestibulum sed neque iaculis,
pharetra nisl a, molestie magna. Aenean commodo lectus erat, non vehicula turpis
tempus a. Orci varius natoque penatibus et magnis dis parturient montes,
nascetur ridiculus mus. Pellentesque tristique massa ac nunc tempor efficitur at
a ligula. Morbi dictum nisl convallis dolor pretium fermentum. Vestibulum nec
tellus nec nunc rutrum mollis non eget ante.
