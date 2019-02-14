# Git guidelines
We work out of develop, and merge to master with stable releases. If working on
a feature, checkout a branch with your issue number and make sure your branch
has a descriptive name. E.g.

`git checkout -b 2-setup-ci-cd`

Once you are done developing™ your feature you can be a friend to the people
you work with, and rebase on develop

`git pull --rebase origin develop`

Nice, you rewrote history. Push your branch (if you have already pushed it, you
might need to force-push). After your branch is pushed, create a pull request
and make sure someone does a code review for you. Once its reviewed, you can
merge / rebase it into develop.



