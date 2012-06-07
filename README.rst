Citation Builder
=====================================================

Citation Builder is an application that generates citations from user entered 
form data. This is built using `citeproc-js <https://bitbucket.org/fbennett/citeproc-js>`_
and CSL styles from http://citationstyles.org/.

See http://www.lib.unc.edu/house/citationbuilder/ for an example.


Building
--------

This step is optional, though it is recommended that you at least use some form
of minification in production as the citeproc-js library is large.

Citation Builder can be built using the `RequireJS optimizer
<http://requirejs.org/docs/optimization.html>`_. For example, when using Node,
from the project root::

$ r.js -o build.js

Note that while the RequireJS optimizer copies over all the files in the js directory,
the only javascript files that are needed once it's built are ``main.js`` and
``require-jquery.js``. If you want to use the OpenURL citation feature, you will
need ``opencite.js`` as well.

Installing
----------

After Citation Builder has been built, upload the ``target`` directory and
modify index-example.html and opencite-example.html. If you skipped the build
step, use the ``src`` directory instead.

OpenURL Support
---------------

The ``opencite.js`` script (and ``opencite-example.html``) provides minimal support
for generating citations from an OpenURL URL.

Adding a new style/source
-------------------------

The forms that are loaded are controlled by the ``source`` query param, and the
citation format is controlled by the ``style`` param. To add a new citation format
you will first need to add the citation format style sheet to the ``src/styles`` directory (see
the `CSL project <https://github.com/citation-style-language/styles>`_ for more styles).
Next, create a directory in ``src/templates`` with the same name as the CSL style sheet
you just added, minus the extension. A `mustache template <https://github.com/janl/mustache.js/>`_
should be created for each source type, currently: book, chapter, journal, magazine,
newspaper and website. Use any of the existing templates as a starting point. The
id attribute for each template should follow the existing pattern, ``tmpl-<source type>``,
as this is used to dynamically include the template.

Several common form fields are included in ``templates/common.mustache``. These can be
added to your form as partials.

Form field names should match the CSL variables for the associated style. Some
data massaging is required for contributors, so you should use the contributor
partial rather than creating your own contributor fields.

Licensing
---------

Unless otherwise noted in the source, this work is released under GNU General
Public License (see LICENSE for details).