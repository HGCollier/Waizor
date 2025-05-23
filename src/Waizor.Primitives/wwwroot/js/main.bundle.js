(function () {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var AvatarStatus;
    (function (AvatarStatus) {
        AvatarStatus[AvatarStatus["Loading"] = 0] = "Loading";
        AvatarStatus[AvatarStatus["Loaded"] = 1] = "Loaded";
        AvatarStatus[AvatarStatus["Error"] = 2] = "Error";
    })(AvatarStatus || (AvatarStatus = {}));
    const avatar = (src, dotNetObject) => {
        const img = new window.Image();
        img.src = src;
        const onStateChange = (status) => __awaiter(void 0, void 0, void 0, function* () {
            yield dotNetObject.invokeMethodAsync("UpdateStatus", status);
        });
        img.addEventListener("load", () => __awaiter(void 0, void 0, void 0, function* () { return yield onStateChange(AvatarStatus.Loaded); }));
        img.addEventListener("error", () => __awaiter(void 0, void 0, void 0, function* () { return yield onStateChange(AvatarStatus.Error); }));
    };

    /*!
    * tabbable 6.2.0
    * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
    */
    // NOTE: separate `:not()` selectors has broader browser support than the newer
    //  `:not([inert], [inert] *)` (Feb 2023)
    // CAREFUL: JSDom does not support `:not([inert] *)` as a selector; using it causes
    //  the entire query to fail, resulting in no nodes found, which will break a lot
    //  of things... so we have to rely on JS to identify nodes inside an inert container
    var candidateSelectors = ['input:not([inert])', 'select:not([inert])', 'textarea:not([inert])', 'a[href]:not([inert])', 'button:not([inert])', '[tabindex]:not(slot):not([inert])', 'audio[controls]:not([inert])', 'video[controls]:not([inert])', '[contenteditable]:not([contenteditable="false"]):not([inert])', 'details>summary:first-of-type:not([inert])', 'details:not([inert])'];
    var candidateSelector = /* #__PURE__ */candidateSelectors.join(',');
    var NoElement = typeof Element === 'undefined';
    var matches = NoElement ? function () {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    var getRootNode = !NoElement && Element.prototype.getRootNode ? function (element) {
      var _element$getRootNode;
      return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
    } : function (element) {
      return element === null || element === void 0 ? void 0 : element.ownerDocument;
    };

    /**
     * Determines if a node is inert or in an inert ancestor.
     * @param {Element} [node]
     * @param {boolean} [lookUp] If true and `node` is not inert, looks up at ancestors to
     *  see if any of them are inert. If false, only `node` itself is considered.
     * @returns {boolean} True if inert itself or by way of being in an inert ancestor.
     *  False if `node` is falsy.
     */
    var isInert = function isInert(node, lookUp) {
      var _node$getAttribute;
      if (lookUp === void 0) {
        lookUp = true;
      }
      // CAREFUL: JSDom does not support inert at all, so we can't use the `HTMLElement.inert`
      //  JS API property; we have to check the attribute, which can either be empty or 'true';
      //  if it's `null` (not specified) or 'false', it's an active element
      var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, 'inert');
      var inert = inertAtt === '' || inertAtt === 'true';

      // NOTE: this could also be handled with `node.matches('[inert], :is([inert] *)')`
      //  if it weren't for `matches()` not being a function on shadow roots; the following
      //  code works for any kind of node
      // CAREFUL: JSDom does not appear to support certain selectors like `:not([inert] *)`
      //  so it likely would not support `:is([inert] *)` either...
      var result = inert || lookUp && node && isInert(node.parentNode); // recursive

      return result;
    };

    /**
     * Determines if a node's content is editable.
     * @param {Element} [node]
     * @returns True if it's content-editable; false if it's not or `node` is falsy.
     */
    var isContentEditable = function isContentEditable(node) {
      var _node$getAttribute2;
      // CAREFUL: JSDom does not support the `HTMLElement.isContentEditable` API so we have
      //  to use the attribute directly to check for this, which can either be empty or 'true';
      //  if it's `null` (not specified) or 'false', it's a non-editable element
      var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, 'contenteditable');
      return attValue === '' || attValue === 'true';
    };

    /**
     * @param {Element} el container to check in
     * @param {boolean} includeContainer add container to check
     * @param {(node: Element) => boolean} filter filter candidates
     * @returns {Element[]}
     */
    var getCandidates = function getCandidates(el, includeContainer, filter) {
      // even if `includeContainer=false`, we still have to check it for inertness because
      //  if it's inert, all its children are inert
      if (isInert(el)) {
        return [];
      }
      var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
      if (includeContainer && matches.call(el, candidateSelector)) {
        candidates.unshift(el);
      }
      candidates = candidates.filter(filter);
      return candidates;
    };

    /**
     * @callback GetShadowRoot
     * @param {Element} element to check for shadow root
     * @returns {ShadowRoot|boolean} ShadowRoot if available or boolean indicating if a shadowRoot is attached but not available.
     */

    /**
     * @callback ShadowRootFilter
     * @param {Element} shadowHostNode the element which contains shadow content
     * @returns {boolean} true if a shadow root could potentially contain valid candidates.
     */

    /**
     * @typedef {Object} CandidateScope
     * @property {Element} scopeParent contains inner candidates
     * @property {Element[]} candidates list of candidates found in the scope parent
     */

    /**
     * @typedef {Object} IterativeOptions
     * @property {GetShadowRoot|boolean} getShadowRoot true if shadow support is enabled; falsy if not;
     *  if a function, implies shadow support is enabled and either returns the shadow root of an element
     *  or a boolean stating if it has an undisclosed shadow root
     * @property {(node: Element) => boolean} filter filter candidates
     * @property {boolean} flatten if true then result will flatten any CandidateScope into the returned list
     * @property {ShadowRootFilter} shadowRootFilter filter shadow roots;
     */

    /**
     * @param {Element[]} elements list of element containers to match candidates from
     * @param {boolean} includeContainer add container list to check
     * @param {IterativeOptions} options
     * @returns {Array.<Element|CandidateScope>}
     */
    var getCandidatesIteratively = function getCandidatesIteratively(elements, includeContainer, options) {
      var candidates = [];
      var elementsToCheck = Array.from(elements);
      while (elementsToCheck.length) {
        var element = elementsToCheck.shift();
        if (isInert(element, false)) {
          // no need to look up since we're drilling down
          // anything inside this container will also be inert
          continue;
        }
        if (element.tagName === 'SLOT') {
          // add shadow dom slot scope (slot itself cannot be focusable)
          var assigned = element.assignedElements();
          var content = assigned.length ? assigned : element.children;
          var nestedCandidates = getCandidatesIteratively(content, true, options);
          if (options.flatten) {
            candidates.push.apply(candidates, nestedCandidates);
          } else {
            candidates.push({
              scopeParent: element,
              candidates: nestedCandidates
            });
          }
        } else {
          // check candidate element
          var validCandidate = matches.call(element, candidateSelector);
          if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element))) {
            candidates.push(element);
          }

          // iterate over shadow content if possible
          var shadowRoot = element.shadowRoot ||
          // check for an undisclosed shadow
          typeof options.getShadowRoot === 'function' && options.getShadowRoot(element);

          // no inert look up because we're already drilling down and checking for inertness
          //  on the way down, so all containers to this root node should have already been
          //  vetted as non-inert
          var validShadowRoot = !isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));
          if (shadowRoot && validShadowRoot) {
            // add shadow dom scope IIF a shadow root node was given; otherwise, an undisclosed
            //  shadow exists, so look at light dom children as fallback BUT create a scope for any
            //  child candidates found because they're likely slotted elements (elements that are
            //  children of the web component element (which has the shadow), in the light dom, but
            //  slotted somewhere _inside_ the undisclosed shadow) -- the scope is created below,
            //  _after_ we return from this recursive call
            var _nestedCandidates = getCandidatesIteratively(shadowRoot === true ? element.children : shadowRoot.children, true, options);
            if (options.flatten) {
              candidates.push.apply(candidates, _nestedCandidates);
            } else {
              candidates.push({
                scopeParent: element,
                candidates: _nestedCandidates
              });
            }
          } else {
            // there's not shadow so just dig into the element's (light dom) children
            //  __without__ giving the element special scope treatment
            elementsToCheck.unshift.apply(elementsToCheck, element.children);
          }
        }
      }
      return candidates;
    };

    /**
     * @private
     * Determines if the node has an explicitly specified `tabindex` attribute.
     * @param {HTMLElement} node
     * @returns {boolean} True if so; false if not.
     */
    var hasTabIndex = function hasTabIndex(node) {
      return !isNaN(parseInt(node.getAttribute('tabindex'), 10));
    };

    /**
     * Determine the tab index of a given node.
     * @param {HTMLElement} node
     * @returns {number} Tab order (negative, 0, or positive number).
     * @throws {Error} If `node` is falsy.
     */
    var getTabIndex = function getTabIndex(node) {
      if (!node) {
        throw new Error('No node provided');
      }
      if (node.tabIndex < 0) {
        // in Chrome, <details/>, <audio controls/> and <video controls/> elements get a default
        // `tabIndex` of -1 when the 'tabindex' attribute isn't specified in the DOM,
        // yet they are still part of the regular tab order; in FF, they get a default
        // `tabIndex` of 0; since Chrome still puts those elements in the regular tab
        // order, consider their tab index to be 0.
        // Also browsers do not return `tabIndex` correctly for contentEditable nodes;
        // so if they don't have a tabindex attribute specifically set, assume it's 0.
        if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) {
          return 0;
        }
      }
      return node.tabIndex;
    };

    /**
     * Determine the tab index of a given node __for sort order purposes__.
     * @param {HTMLElement} node
     * @param {boolean} [isScope] True for a custom element with shadow root or slot that, by default,
     *  has tabIndex -1, but needs to be sorted by document order in order for its content to be
     *  inserted into the correct sort position.
     * @returns {number} Tab order (negative, 0, or positive number).
     */
    var getSortOrderTabIndex = function getSortOrderTabIndex(node, isScope) {
      var tabIndex = getTabIndex(node);
      if (tabIndex < 0 && isScope && !hasTabIndex(node)) {
        return 0;
      }
      return tabIndex;
    };
    var sortOrderedTabbables = function sortOrderedTabbables(a, b) {
      return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
    };
    var isInput = function isInput(node) {
      return node.tagName === 'INPUT';
    };
    var isHiddenInput = function isHiddenInput(node) {
      return isInput(node) && node.type === 'hidden';
    };
    var isDetailsWithSummary = function isDetailsWithSummary(node) {
      var r = node.tagName === 'DETAILS' && Array.prototype.slice.apply(node.children).some(function (child) {
        return child.tagName === 'SUMMARY';
      });
      return r;
    };
    var getCheckedRadio = function getCheckedRadio(nodes, form) {
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].checked && nodes[i].form === form) {
          return nodes[i];
        }
      }
    };
    var isTabbableRadio = function isTabbableRadio(node) {
      if (!node.name) {
        return true;
      }
      var radioScope = node.form || getRootNode(node);
      var queryRadios = function queryRadios(name) {
        return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
      };
      var radioSet;
      if (typeof window !== 'undefined' && typeof window.CSS !== 'undefined' && typeof window.CSS.escape === 'function') {
        radioSet = queryRadios(window.CSS.escape(node.name));
      } else {
        try {
          radioSet = queryRadios(node.name);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s', err.message);
          return false;
        }
      }
      var checked = getCheckedRadio(radioSet, node.form);
      return !checked || checked === node;
    };
    var isRadio = function isRadio(node) {
      return isInput(node) && node.type === 'radio';
    };
    var isNonTabbableRadio = function isNonTabbableRadio(node) {
      return isRadio(node) && !isTabbableRadio(node);
    };

    // determines if a node is ultimately attached to the window's document
    var isNodeAttached = function isNodeAttached(node) {
      var _nodeRoot;
      // The root node is the shadow root if the node is in a shadow DOM; some document otherwise
      //  (but NOT _the_ document; see second 'If' comment below for more).
      // If rootNode is shadow root, it'll have a host, which is the element to which the shadow
      //  is attached, and the one we need to check if it's in the document or not (because the
      //  shadow, and all nodes it contains, is never considered in the document since shadows
      //  behave like self-contained DOMs; but if the shadow's HOST, which is part of the document,
      //  is hidden, or is not in the document itself but is detached, it will affect the shadow's
      //  visibility, including all the nodes it contains). The host could be any normal node,
      //  or a custom element (i.e. web component). Either way, that's the one that is considered
      //  part of the document, not the shadow root, nor any of its children (i.e. the node being
      //  tested).
      // To further complicate things, we have to look all the way up until we find a shadow HOST
      //  that is attached (or find none) because the node might be in nested shadows...
      // If rootNode is not a shadow root, it won't have a host, and so rootNode should be the
      //  document (per the docs) and while it's a Document-type object, that document does not
      //  appear to be the same as the node's `ownerDocument` for some reason, so it's safer
      //  to ignore the rootNode at this point, and use `node.ownerDocument`. Otherwise,
      //  using `rootNode.contains(node)` will _always_ be true we'll get false-positives when
      //  node is actually detached.
      // NOTE: If `nodeRootHost` or `node` happens to be the `document` itself (which is possible
      //  if a tabbable/focusable node was quickly added to the DOM, focused, and then removed
      //  from the DOM as in https://github.com/focus-trap/focus-trap-react/issues/905), then
      //  `ownerDocument` will be `null`, hence the optional chaining on it.
      var nodeRoot = node && getRootNode(node);
      var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;

      // in some cases, a detached node will return itself as the root instead of a document or
      //  shadow root object, in which case, we shouldn't try to look further up the host chain
      var attached = false;
      if (nodeRoot && nodeRoot !== node) {
        var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
        attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
        while (!attached && nodeRootHost) {
          var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
          // since it's not attached and we have a root host, the node MUST be in a nested shadow DOM,
          //  which means we need to get the host's host and check if that parent host is contained
          //  in (i.e. attached to) the document
          nodeRoot = getRootNode(nodeRootHost);
          nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
          attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
        }
      }
      return attached;
    };
    var isZeroArea = function isZeroArea(node) {
      var _node$getBoundingClie = node.getBoundingClientRect(),
        width = _node$getBoundingClie.width,
        height = _node$getBoundingClie.height;
      return width === 0 && height === 0;
    };
    var isHidden = function isHidden(node, _ref) {
      var displayCheck = _ref.displayCheck,
        getShadowRoot = _ref.getShadowRoot;
      // NOTE: visibility will be `undefined` if node is detached from the document
      //  (see notes about this further down), which means we will consider it visible
      //  (this is legacy behavior from a very long way back)
      // NOTE: we check this regardless of `displayCheck="none"` because this is a
      //  _visibility_ check, not a _display_ check
      if (getComputedStyle(node).visibility === 'hidden') {
        return true;
      }
      var isDirectSummary = matches.call(node, 'details>summary:first-of-type');
      var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
      if (matches.call(nodeUnderDetails, 'details:not([open]) *')) {
        return true;
      }
      if (!displayCheck || displayCheck === 'full' || displayCheck === 'legacy-full') {
        if (typeof getShadowRoot === 'function') {
          // figure out if we should consider the node to be in an undisclosed shadow and use the
          //  'non-zero-area' fallback
          var originalNode = node;
          while (node) {
            var parentElement = node.parentElement;
            var rootNode = getRootNode(node);
            if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true // check if there's an undisclosed shadow
            ) {
              // node has an undisclosed shadow which means we can only treat it as a black box, so we
              //  fall back to a non-zero-area test
              return isZeroArea(node);
            } else if (node.assignedSlot) {
              // iterate up slot
              node = node.assignedSlot;
            } else if (!parentElement && rootNode !== node.ownerDocument) {
              // cross shadow boundary
              node = rootNode.host;
            } else {
              // iterate up normal dom
              node = parentElement;
            }
          }
          node = originalNode;
        }
        // else, `getShadowRoot` might be true, but all that does is enable shadow DOM support
        //  (i.e. it does not also presume that all nodes might have undisclosed shadows); or
        //  it might be a falsy value, which means shadow DOM support is disabled

        // Since we didn't find it sitting in an undisclosed shadow (or shadows are disabled)
        //  now we can just test to see if it would normally be visible or not, provided it's
        //  attached to the main document.
        // NOTE: We must consider case where node is inside a shadow DOM and given directly to
        //  `isTabbable()` or `isFocusable()` -- regardless of `getShadowRoot` option setting.

        if (isNodeAttached(node)) {
          // this works wherever the node is: if there's at least one client rect, it's
          //  somehow displayed; it also covers the CSS 'display: contents' case where the
          //  node itself is hidden in place of its contents; and there's no need to search
          //  up the hierarchy either
          return !node.getClientRects().length;
        }

        // Else, the node isn't attached to the document, which means the `getClientRects()`
        //  API will __always__ return zero rects (this can happen, for example, if React
        //  is used to render nodes onto a detached tree, as confirmed in this thread:
        //  https://github.com/facebook/react/issues/9117#issuecomment-284228870)
        //
        // It also means that even window.getComputedStyle(node).display will return `undefined`
        //  because styles are only computed for nodes that are in the document.
        //
        // NOTE: THIS HAS BEEN THE CASE FOR YEARS. It is not new, nor is it caused by tabbable
        //  somehow. Though it was never stated officially, anyone who has ever used tabbable
        //  APIs on nodes in detached containers has actually implicitly used tabbable in what
        //  was later (as of v5.2.0 on Apr 9, 2021) called `displayCheck="none"` mode -- essentially
        //  considering __everything__ to be visible because of the innability to determine styles.
        //
        // v6.0.0: As of this major release, the default 'full' option __no longer treats detached
        //  nodes as visible with the 'none' fallback.__
        if (displayCheck !== 'legacy-full') {
          return true; // hidden
        }
        // else, fallback to 'none' mode and consider the node visible
      } else if (displayCheck === 'non-zero-area') {
        // NOTE: Even though this tests that the node's client rect is non-zero to determine
        //  whether it's displayed, and that a detached node will __always__ have a zero-area
        //  client rect, we don't special-case for whether the node is attached or not. In
        //  this mode, we do want to consider nodes that have a zero area to be hidden at all
        //  times, and that includes attached or not.
        return isZeroArea(node);
      }

      // visible, as far as we can tell, or per current `displayCheck=none` mode, we assume
      //  it's visible
      return false;
    };

    // form fields (nested) inside a disabled fieldset are not focusable/tabbable
    //  unless they are in the _first_ <legend> element of the top-most disabled
    //  fieldset
    var isDisabledFromFieldset = function isDisabledFromFieldset(node) {
      if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
        var parentNode = node.parentElement;
        // check if `node` is contained in a disabled <fieldset>
        while (parentNode) {
          if (parentNode.tagName === 'FIELDSET' && parentNode.disabled) {
            // look for the first <legend> among the children of the disabled <fieldset>
            for (var i = 0; i < parentNode.children.length; i++) {
              var child = parentNode.children.item(i);
              // when the first <legend> (in document order) is found
              if (child.tagName === 'LEGEND') {
                // if its parent <fieldset> is not nested in another disabled <fieldset>,
                // return whether `node` is a descendant of its first <legend>
                return matches.call(parentNode, 'fieldset[disabled] *') ? true : !child.contains(node);
              }
            }
            // the disabled <fieldset> containing `node` has no <legend>
            return true;
          }
          parentNode = parentNode.parentElement;
        }
      }

      // else, node's tabbable/focusable state should not be affected by a fieldset's
      //  enabled/disabled state
      return false;
    };
    var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable(options, node) {
      if (node.disabled ||
      // we must do an inert look up to filter out any elements inside an inert ancestor
      //  because we're limited in the type of selectors we can use in JSDom (see related
      //  note related to `candidateSelectors`)
      isInert(node) || isHiddenInput(node) || isHidden(node, options) ||
      // For a details element with a summary, the summary element gets the focus
      isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
        return false;
      }
      return true;
    };
    var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable(options, node) {
      if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
        return false;
      }
      return true;
    };
    var isValidShadowRootTabbable = function isValidShadowRootTabbable(shadowHostNode) {
      var tabIndex = parseInt(shadowHostNode.getAttribute('tabindex'), 10);
      if (isNaN(tabIndex) || tabIndex >= 0) {
        return true;
      }
      // If a custom element has an explicit negative tabindex,
      // browsers will not allow tab targeting said element's children.
      return false;
    };

    /**
     * @param {Array.<Element|CandidateScope>} candidates
     * @returns Element[]
     */
    var sortByOrder = function sortByOrder(candidates) {
      var regularTabbables = [];
      var orderedTabbables = [];
      candidates.forEach(function (item, i) {
        var isScope = !!item.scopeParent;
        var element = isScope ? item.scopeParent : item;
        var candidateTabindex = getSortOrderTabIndex(element, isScope);
        var elements = isScope ? sortByOrder(item.candidates) : element;
        if (candidateTabindex === 0) {
          isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
        } else {
          orderedTabbables.push({
            documentOrder: i,
            tabIndex: candidateTabindex,
            item: item,
            isScope: isScope,
            content: elements
          });
        }
      });
      return orderedTabbables.sort(sortOrderedTabbables).reduce(function (acc, sortable) {
        sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
        return acc;
      }, []).concat(regularTabbables);
    };
    var tabbable = function tabbable(container, options) {
      options = options || {};
      var candidates;
      if (options.getShadowRoot) {
        candidates = getCandidatesIteratively([container], options.includeContainer, {
          filter: isNodeMatchingSelectorTabbable.bind(null, options),
          flatten: false,
          getShadowRoot: options.getShadowRoot,
          shadowRootFilter: isValidShadowRootTabbable
        });
      } else {
        candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
      }
      return sortByOrder(candidates);
    };
    var focusable = function focusable(container, options) {
      options = options || {};
      var candidates;
      if (options.getShadowRoot) {
        candidates = getCandidatesIteratively([container], options.includeContainer, {
          filter: isNodeMatchingSelectorFocusable.bind(null, options),
          flatten: true,
          getShadowRoot: options.getShadowRoot
        });
      } else {
        candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
      }
      return candidates;
    };
    var isTabbable = function isTabbable(node, options) {
      options = options || {};
      if (!node) {
        throw new Error('No node provided');
      }
      if (matches.call(node, candidateSelector) === false) {
        return false;
      }
      return isNodeMatchingSelectorTabbable(options, node);
    };
    var focusableCandidateSelector = /* #__PURE__ */candidateSelectors.concat('iframe').join(',');
    var isFocusable = function isFocusable(node, options) {
      options = options || {};
      if (!node) {
        throw new Error('No node provided');
      }
      if (matches.call(node, focusableCandidateSelector) === false) {
        return false;
      }
      return isNodeMatchingSelectorFocusable(options, node);
    };

    /*!
    * focus-trap 7.6.4
    * @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
    */

    function _arrayLikeToArray(r, a) {
      (null == a || a > r.length) && (a = r.length);
      for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
      return n;
    }
    function _arrayWithoutHoles(r) {
      if (Array.isArray(r)) return _arrayLikeToArray(r);
    }
    function _defineProperty(e, r, t) {
      return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: true,
        configurable: true,
        writable: true
      }) : e[r] = t, e;
    }
    function _iterableToArray(r) {
      if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
    }
    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function (r) {
          return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread2(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
          _defineProperty(e, r, t[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
          Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
      }
      return e;
    }
    function _toConsumableArray(r) {
      return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
    }
    function _toPrimitive(t, r) {
      if ("object" != typeof t || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (undefined !== e) {
        var i = e.call(t, r);
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }
    function _unsupportedIterableToArray(r, a) {
      if (r) {
        if ("string" == typeof r) return _arrayLikeToArray(r, a);
        var t = {}.toString.call(r).slice(8, -1);
        return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : undefined;
      }
    }

    var activeFocusTraps = {
      activateTrap: function activateTrap(trapStack, trap) {
        if (trapStack.length > 0) {
          var activeTrap = trapStack[trapStack.length - 1];
          if (activeTrap !== trap) {
            activeTrap._setPausedState(true);
          }
        }
        var trapIndex = trapStack.indexOf(trap);
        if (trapIndex === -1) {
          trapStack.push(trap);
        } else {
          // move this existing trap to the front of the queue
          trapStack.splice(trapIndex, 1);
          trapStack.push(trap);
        }
      },
      deactivateTrap: function deactivateTrap(trapStack, trap) {
        var trapIndex = trapStack.indexOf(trap);
        if (trapIndex !== -1) {
          trapStack.splice(trapIndex, 1);
        }
        if (trapStack.length > 0 && !trapStack[trapStack.length - 1]._isManuallyPaused()) {
          trapStack[trapStack.length - 1]._setPausedState(false);
        }
      }
    };
    var isSelectableInput = function isSelectableInput(node) {
      return node.tagName && node.tagName.toLowerCase() === 'input' && typeof node.select === 'function';
    };
    var isEscapeEvent = function isEscapeEvent(e) {
      return (e === null || e === undefined ? undefined : e.key) === 'Escape' || (e === null || e === undefined ? undefined : e.key) === 'Esc' || (e === null || e === undefined ? undefined : e.keyCode) === 27;
    };
    var isTabEvent = function isTabEvent(e) {
      return (e === null || e === undefined ? undefined : e.key) === 'Tab' || (e === null || e === undefined ? undefined : e.keyCode) === 9;
    };

    // checks for TAB by default
    var isKeyForward = function isKeyForward(e) {
      return isTabEvent(e) && !e.shiftKey;
    };

    // checks for SHIFT+TAB by default
    var isKeyBackward = function isKeyBackward(e) {
      return isTabEvent(e) && e.shiftKey;
    };
    var delay = function delay(fn) {
      return setTimeout(fn, 0);
    };

    /**
     * Get an option's value when it could be a plain value, or a handler that provides
     *  the value.
     * @param {*} value Option's value to check.
     * @param {...*} [params] Any parameters to pass to the handler, if `value` is a function.
     * @returns {*} The `value`, or the handler's returned value.
     */
    var valueOrHandler = function valueOrHandler(value) {
      for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }
      return typeof value === 'function' ? value.apply(undefined, params) : value;
    };
    var getActualTarget = function getActualTarget(event) {
      // NOTE: If the trap is _inside_ a shadow DOM, event.target will always be the
      //  shadow host. However, event.target.composedPath() will be an array of
      //  nodes "clicked" from inner-most (the actual element inside the shadow) to
      //  outer-most (the host HTML document). If we have access to composedPath(),
      //  then use its first element; otherwise, fall back to event.target (and
      //  this only works for an _open_ shadow DOM; otherwise,
      //  composedPath()[0] === event.target always).
      return event.target.shadowRoot && typeof event.composedPath === 'function' ? event.composedPath()[0] : event.target;
    };

    // NOTE: this must be _outside_ `createFocusTrap()` to make sure all traps in this
    //  current instance use the same stack if `userOptions.trapStack` isn't specified
    var internalTrapStack = [];
    var createFocusTrap = function createFocusTrap(elements, userOptions) {
      // SSR: a live trap shouldn't be created in this type of environment so this
      //  should be safe code to execute if the `document` option isn't specified
      var doc = (userOptions === null || userOptions === undefined ? undefined : userOptions.document) || document;
      var trapStack = (userOptions === null || userOptions === undefined ? undefined : userOptions.trapStack) || internalTrapStack;
      var config = _objectSpread2({
        returnFocusOnDeactivate: true,
        escapeDeactivates: true,
        delayInitialFocus: true,
        isKeyForward: isKeyForward,
        isKeyBackward: isKeyBackward
      }, userOptions);
      var state = {
        // containers given to createFocusTrap()
        // @type {Array<HTMLElement>}
        containers: [],
        // list of objects identifying tabbable nodes in `containers` in the trap
        // NOTE: it's possible that a group has no tabbable nodes if nodes get removed while the trap
        //  is active, but the trap should never get to a state where there isn't at least one group
        //  with at least one tabbable node in it (that would lead to an error condition that would
        //  result in an error being thrown)
        // @type {Array<{
        //   container: HTMLElement,
        //   tabbableNodes: Array<HTMLElement>, // empty if none
        //   focusableNodes: Array<HTMLElement>, // empty if none
        //   posTabIndexesFound: boolean,
        //   firstTabbableNode: HTMLElement|undefined,
        //   lastTabbableNode: HTMLElement|undefined,
        //   firstDomTabbableNode: HTMLElement|undefined,
        //   lastDomTabbableNode: HTMLElement|undefined,
        //   nextTabbableNode: (node: HTMLElement, forward: boolean) => HTMLElement|undefined
        // }>}
        containerGroups: [],
        // same order/length as `containers` list

        // references to objects in `containerGroups`, but only those that actually have
        //  tabbable nodes in them
        // NOTE: same order as `containers` and `containerGroups`, but __not necessarily__
        //  the same length
        tabbableGroups: [],
        nodeFocusedBeforeActivation: null,
        mostRecentlyFocusedNode: null,
        active: false,
        paused: false,
        manuallyPaused: false,
        // timer ID for when delayInitialFocus is true and initial focus in this trap
        //  has been delayed during activation
        delayInitialFocusTimer: undefined,
        // the most recent KeyboardEvent for the configured nav key (typically [SHIFT+]TAB), if any
        recentNavEvent: undefined
      };
      var trap; // eslint-disable-line prefer-const -- some private functions reference it, and its methods reference private functions, so we must declare here and define later

      /**
       * Gets a configuration option value.
       * @param {Object|undefined} configOverrideOptions If true, and option is defined in this set,
       *  value will be taken from this object. Otherwise, value will be taken from base configuration.
       * @param {string} optionName Name of the option whose value is sought.
       * @param {string|undefined} [configOptionName] Name of option to use __instead of__ `optionName`
       *  IIF `configOverrideOptions` is not defined. Otherwise, `optionName` is used.
       */
      var getOption = function getOption(configOverrideOptions, optionName, configOptionName) {
        return configOverrideOptions && configOverrideOptions[optionName] !== undefined ? configOverrideOptions[optionName] : config[configOptionName || optionName];
      };

      /**
       * Finds the index of the container that contains the element.
       * @param {HTMLElement} element
       * @param {Event} [event] If available, and `element` isn't directly found in any container,
       *  the event's composed path is used to see if includes any known trap containers in the
       *  case where the element is inside a Shadow DOM.
       * @returns {number} Index of the container in either `state.containers` or
       *  `state.containerGroups` (the order/length of these lists are the same); -1
       *  if the element isn't found.
       */
      var findContainerIndex = function findContainerIndex(element, event) {
        var composedPath = typeof (event === null || event === undefined ? undefined : event.composedPath) === 'function' ? event.composedPath() : undefined;
        // NOTE: search `containerGroups` because it's possible a group contains no tabbable
        //  nodes, but still contains focusable nodes (e.g. if they all have `tabindex=-1`)
        //  and we still need to find the element in there
        return state.containerGroups.findIndex(function (_ref) {
          var container = _ref.container,
            tabbableNodes = _ref.tabbableNodes;
          return container.contains(element) || (// fall back to explicit tabbable search which will take into consideration any
          //  web components if the `tabbableOptions.getShadowRoot` option was used for
          //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
          //  look inside web components even if open)
          composedPath === null || composedPath === undefined ? undefined : composedPath.includes(container)) || tabbableNodes.find(function (node) {
            return node === element;
          });
        });
      };

      /**
       * Gets the node for the given option, which is expected to be an option that
       *  can be either a DOM node, a string that is a selector to get a node, `false`
       *  (if a node is explicitly NOT given), or a function that returns any of these
       *  values.
       * @param {string} optionName
       * @param {Object} options
       * @param {boolean} [options.hasFallback] True if the option could be a selector string
       *  and the option allows for a fallback scenario in the case where the selector is
       *  valid but does not match a node (i.e. the queried node doesn't exist in the DOM).
       * @param {Array} [options.params] Params to pass to the option if it's a function.
       * @returns {undefined | null | false | HTMLElement | SVGElement} Returns
       *  `undefined` if the option is not specified; `null` if the option didn't resolve
       *  to a node but `options.hasFallback=true`, `false` if the option resolved to `false`
       *  (node explicitly not given); otherwise, the resolved DOM node.
       * @throws {Error} If the option is set, not `false`, and is not, or does not
       *  resolve to a node, unless the option is a selector string and `options.hasFallback=true`.
       */
      var getNodeForOption = function getNodeForOption(optionName) {
        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$hasFallback = _ref2.hasFallback,
          hasFallback = _ref2$hasFallback === undefined ? false : _ref2$hasFallback,
          _ref2$params = _ref2.params,
          params = _ref2$params === undefined ? [] : _ref2$params;
        var optionValue = config[optionName];
        if (typeof optionValue === 'function') {
          optionValue = optionValue.apply(undefined, _toConsumableArray(params));
        }
        if (optionValue === true) {
          optionValue = undefined; // use default value
        }
        if (!optionValue) {
          if (optionValue === undefined || optionValue === false) {
            return optionValue;
          }
          // else, empty string (invalid), null (invalid), 0 (invalid)

          throw new Error("`".concat(optionName, "` was specified but was not a node, or did not return a node"));
        }
        var node = optionValue; // could be HTMLElement, SVGElement, or non-empty string at this point

        if (typeof optionValue === 'string') {
          try {
            node = doc.querySelector(optionValue); // resolve to node, or null if fails
          } catch (err) {
            throw new Error("`".concat(optionName, "` appears to be an invalid selector; error=\"").concat(err.message, "\""));
          }
          if (!node) {
            if (!hasFallback) {
              throw new Error("`".concat(optionName, "` as selector refers to no known node"));
            }
            // else, `node` MUST be `null` because that's what `Document.querySelector()` returns
            //  if the selector is valid but doesn't match anything
          }
        }
        return node;
      };
      var getInitialFocusNode = function getInitialFocusNode() {
        var node = getNodeForOption('initialFocus', {
          hasFallback: true
        });

        // false explicitly indicates we want no initialFocus at all
        if (node === false) {
          return false;
        }
        if (node === undefined || node && !isFocusable(node, config.tabbableOptions)) {
          // option not specified nor focusable: use fallback options
          if (findContainerIndex(doc.activeElement) >= 0) {
            node = doc.activeElement;
          } else {
            var firstTabbableGroup = state.tabbableGroups[0];
            var firstTabbableNode = firstTabbableGroup && firstTabbableGroup.firstTabbableNode;

            // NOTE: `fallbackFocus` option function cannot return `false` (not supported)
            node = firstTabbableNode || getNodeForOption('fallbackFocus');
          }
        } else if (node === null) {
          // option is a VALID selector string that doesn't yield a node: use the `fallbackFocus`
          //  option instead of the default behavior when the option isn't specified at all
          node = getNodeForOption('fallbackFocus');
        }
        if (!node) {
          throw new Error('Your focus-trap needs to have at least one focusable element');
        }
        return node;
      };
      var updateTabbableNodes = function updateTabbableNodes() {
        state.containerGroups = state.containers.map(function (container) {
          var tabbableNodes = tabbable(container, config.tabbableOptions);

          // NOTE: if we have tabbable nodes, we must have focusable nodes; focusable nodes
          //  are a superset of tabbable nodes since nodes with negative `tabindex` attributes
          //  are focusable but not tabbable
          var focusableNodes = focusable(container, config.tabbableOptions);
          var firstTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[0] : undefined;
          var lastTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[tabbableNodes.length - 1] : undefined;
          var firstDomTabbableNode = focusableNodes.find(function (node) {
            return isTabbable(node);
          });
          var lastDomTabbableNode = focusableNodes.slice().reverse().find(function (node) {
            return isTabbable(node);
          });
          var posTabIndexesFound = !!tabbableNodes.find(function (node) {
            return getTabIndex(node) > 0;
          });
          return {
            container: container,
            tabbableNodes: tabbableNodes,
            focusableNodes: focusableNodes,
            /** True if at least one node with positive `tabindex` was found in this container. */
            posTabIndexesFound: posTabIndexesFound,
            /** First tabbable node in container, __tabindex__ order; `undefined` if none. */
            firstTabbableNode: firstTabbableNode,
            /** Last tabbable node in container, __tabindex__ order; `undefined` if none. */
            lastTabbableNode: lastTabbableNode,
            // NOTE: DOM order is NOT NECESSARILY "document position" order, but figuring that out
            //  would require more than just https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
            //  because that API doesn't work with Shadow DOM as well as it should (@see
            //  https://github.com/whatwg/dom/issues/320) and since this first/last is only needed, so far,
            //  to address an edge case related to positive tabindex support, this seems like a much easier,
            //  "close enough most of the time" alternative for positive tabindexes which should generally
            //  be avoided anyway...
            /** First tabbable node in container, __DOM__ order; `undefined` if none. */
            firstDomTabbableNode: firstDomTabbableNode,
            /** Last tabbable node in container, __DOM__ order; `undefined` if none. */
            lastDomTabbableNode: lastDomTabbableNode,
            /**
             * Finds the __tabbable__ node that follows the given node in the specified direction,
             *  in this container, if any.
             * @param {HTMLElement} node
             * @param {boolean} [forward] True if going in forward tab order; false if going
             *  in reverse.
             * @returns {HTMLElement|undefined} The next tabbable node, if any.
             */
            nextTabbableNode: function nextTabbableNode(node) {
              var forward = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
              var nodeIdx = tabbableNodes.indexOf(node);
              if (nodeIdx < 0) {
                // either not tabbable nor focusable, or was focused but not tabbable (negative tabindex):
                //  since `node` should at least have been focusable, we assume that's the case and mimic
                //  what browsers do, which is set focus to the next node in __document position order__,
                //  regardless of positive tabindexes, if any -- and for reasons explained in the NOTE
                //  above related to `firstDomTabbable` and `lastDomTabbable` properties, we fall back to
                //  basic DOM order
                if (forward) {
                  return focusableNodes.slice(focusableNodes.indexOf(node) + 1).find(function (el) {
                    return isTabbable(el);
                  });
                }
                return focusableNodes.slice(0, focusableNodes.indexOf(node)).reverse().find(function (el) {
                  return isTabbable(el);
                });
              }
              return tabbableNodes[nodeIdx + (forward ? 1 : -1)];
            }
          };
        });
        state.tabbableGroups = state.containerGroups.filter(function (group) {
          return group.tabbableNodes.length > 0;
        });

        // throw if no groups have tabbable nodes and we don't have a fallback focus node either
        if (state.tabbableGroups.length <= 0 && !getNodeForOption('fallbackFocus') // returning false not supported for this option
        ) {
          throw new Error('Your focus-trap must have at least one container with at least one tabbable node in it at all times');
        }

        // NOTE: Positive tabindexes are only properly supported in single-container traps because
        //  doing it across multiple containers where tabindexes could be all over the place
        //  would require Tabbable to support multiple containers, would require additional
        //  specialized Shadow DOM support, and would require Tabbable's multi-container support
        //  to look at those containers in document position order rather than user-provided
        //  order (as they are treated in Focus-trap, for legacy reasons). See discussion on
        //  https://github.com/focus-trap/focus-trap/issues/375 for more details.
        if (state.containerGroups.find(function (g) {
          return g.posTabIndexesFound;
        }) && state.containerGroups.length > 1) {
          throw new Error("At least one node with a positive tabindex was found in one of your focus-trap's multiple containers. Positive tabindexes are only supported in single-container focus-traps.");
        }
      };

      /**
       * Gets the current activeElement. If it's a web-component and has open shadow-root
       * it will recursively search inside shadow roots for the "true" activeElement.
       *
       * @param {Document | ShadowRoot} el
       *
       * @returns {HTMLElement} The element that currently has the focus
       **/
      var _getActiveElement = function getActiveElement(el) {
        var activeElement = el.activeElement;
        if (!activeElement) {
          return;
        }
        if (activeElement.shadowRoot && activeElement.shadowRoot.activeElement !== null) {
          return _getActiveElement(activeElement.shadowRoot);
        }
        return activeElement;
      };
      var _tryFocus = function tryFocus(node) {
        if (node === false) {
          return;
        }
        if (node === _getActiveElement(document)) {
          return;
        }
        if (!node || !node.focus) {
          _tryFocus(getInitialFocusNode());
          return;
        }
        node.focus({
          preventScroll: !!config.preventScroll
        });
        // NOTE: focus() API does not trigger focusIn event so set MRU node manually
        state.mostRecentlyFocusedNode = node;
        if (isSelectableInput(node)) {
          node.select();
        }
      };
      var getReturnFocusNode = function getReturnFocusNode(previousActiveElement) {
        var node = getNodeForOption('setReturnFocus', {
          params: [previousActiveElement]
        });
        return node ? node : node === false ? false : previousActiveElement;
      };

      /**
       * Finds the next node (in either direction) where focus should move according to a
       *  keyboard focus-in event.
       * @param {Object} params
       * @param {Node} [params.target] Known target __from which__ to navigate, if any.
       * @param {KeyboardEvent|FocusEvent} [params.event] Event to use if `target` isn't known (event
       *  will be used to determine the `target`). Ignored if `target` is specified.
       * @param {boolean} [params.isBackward] True if focus should move backward.
       * @returns {Node|undefined} The next node, or `undefined` if a next node couldn't be
       *  determined given the current state of the trap.
       */
      var findNextNavNode = function findNextNavNode(_ref3) {
        var target = _ref3.target,
          event = _ref3.event,
          _ref3$isBackward = _ref3.isBackward,
          isBackward = _ref3$isBackward === undefined ? false : _ref3$isBackward;
        target = target || getActualTarget(event);
        updateTabbableNodes();
        var destinationNode = null;
        if (state.tabbableGroups.length > 0) {
          // make sure the target is actually contained in a group
          // NOTE: the target may also be the container itself if it's focusable
          //  with tabIndex='-1' and was given initial focus
          var containerIndex = findContainerIndex(target, event);
          var containerGroup = containerIndex >= 0 ? state.containerGroups[containerIndex] : undefined;
          if (containerIndex < 0) {
            // target not found in any group: quite possible focus has escaped the trap,
            //  so bring it back into...
            if (isBackward) {
              // ...the last node in the last group
              destinationNode = state.tabbableGroups[state.tabbableGroups.length - 1].lastTabbableNode;
            } else {
              // ...the first node in the first group
              destinationNode = state.tabbableGroups[0].firstTabbableNode;
            }
          } else if (isBackward) {
            // REVERSE

            // is the target the first tabbable node in a group?
            var startOfGroupIndex = state.tabbableGroups.findIndex(function (_ref4) {
              var firstTabbableNode = _ref4.firstTabbableNode;
              return target === firstTabbableNode;
            });
            if (startOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target, false))) {
              // an exception case where the target is either the container itself, or
              //  a non-tabbable node that was given focus (i.e. tabindex is negative
              //  and user clicked on it or node was programmatically given focus)
              //  and is not followed by any other tabbable node, in which
              //  case, we should handle shift+tab as if focus were on the container's
              //  first tabbable node, and go to the last tabbable node of the LAST group
              startOfGroupIndex = containerIndex;
            }
            if (startOfGroupIndex >= 0) {
              // YES: then shift+tab should go to the last tabbable node in the
              //  previous group (and wrap around to the last tabbable node of
              //  the LAST group if it's the first tabbable node of the FIRST group)
              var destinationGroupIndex = startOfGroupIndex === 0 ? state.tabbableGroups.length - 1 : startOfGroupIndex - 1;
              var destinationGroup = state.tabbableGroups[destinationGroupIndex];
              destinationNode = getTabIndex(target) >= 0 ? destinationGroup.lastTabbableNode : destinationGroup.lastDomTabbableNode;
            } else if (!isTabEvent(event)) {
              // user must have customized the nav keys so we have to move focus manually _within_
              //  the active group: do this based on the order determined by tabbable()
              destinationNode = containerGroup.nextTabbableNode(target, false);
            }
          } else {
            // FORWARD

            // is the target the last tabbable node in a group?
            var lastOfGroupIndex = state.tabbableGroups.findIndex(function (_ref5) {
              var lastTabbableNode = _ref5.lastTabbableNode;
              return target === lastTabbableNode;
            });
            if (lastOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target))) {
              // an exception case where the target is the container itself, or
              //  a non-tabbable node that was given focus (i.e. tabindex is negative
              //  and user clicked on it or node was programmatically given focus)
              //  and is not followed by any other tabbable node, in which
              //  case, we should handle tab as if focus were on the container's
              //  last tabbable node, and go to the first tabbable node of the FIRST group
              lastOfGroupIndex = containerIndex;
            }
            if (lastOfGroupIndex >= 0) {
              // YES: then tab should go to the first tabbable node in the next
              //  group (and wrap around to the first tabbable node of the FIRST
              //  group if it's the last tabbable node of the LAST group)
              var _destinationGroupIndex = lastOfGroupIndex === state.tabbableGroups.length - 1 ? 0 : lastOfGroupIndex + 1;
              var _destinationGroup = state.tabbableGroups[_destinationGroupIndex];
              destinationNode = getTabIndex(target) >= 0 ? _destinationGroup.firstTabbableNode : _destinationGroup.firstDomTabbableNode;
            } else if (!isTabEvent(event)) {
              // user must have customized the nav keys so we have to move focus manually _within_
              //  the active group: do this based on the order determined by tabbable()
              destinationNode = containerGroup.nextTabbableNode(target);
            }
          }
        } else {
          // no groups available
          // NOTE: the fallbackFocus option does not support returning false to opt-out
          destinationNode = getNodeForOption('fallbackFocus');
        }
        return destinationNode;
      };

      // This needs to be done on mousedown and touchstart instead of click
      // so that it precedes the focus event.
      var checkPointerDown = function checkPointerDown(e) {
        var target = getActualTarget(e);
        if (findContainerIndex(target, e) >= 0) {
          // allow the click since it ocurred inside the trap
          return;
        }
        if (valueOrHandler(config.clickOutsideDeactivates, e)) {
          // immediately deactivate the trap
          trap.deactivate({
            // NOTE: by setting `returnFocus: false`, deactivate() will do nothing,
            //  which will result in the outside click setting focus to the node
            //  that was clicked (and if not focusable, to "nothing"); by setting
            //  `returnFocus: true`, we'll attempt to re-focus the node originally-focused
            //  on activation (or the configured `setReturnFocus` node), whether the
            //  outside click was on a focusable node or not
            returnFocus: config.returnFocusOnDeactivate
          });
          return;
        }

        // This is needed for mobile devices.
        // (If we'll only let `click` events through,
        // then on mobile they will be blocked anyways if `touchstart` is blocked.)
        if (valueOrHandler(config.allowOutsideClick, e)) {
          // allow the click outside the trap to take place
          return;
        }

        // otherwise, prevent the click
        e.preventDefault();
      };

      // In case focus escapes the trap for some strange reason, pull it back in.
      // NOTE: the focusIn event is NOT cancelable, so if focus escapes, it may cause unexpected
      //  scrolling if the node that got focused was out of view; there's nothing we can do to
      //  prevent that from happening by the time we discover that focus escaped
      var checkFocusIn = function checkFocusIn(event) {
        var target = getActualTarget(event);
        var targetContained = findContainerIndex(target, event) >= 0;

        // In Firefox when you Tab out of an iframe the Document is briefly focused.
        if (targetContained || target instanceof Document) {
          if (targetContained) {
            state.mostRecentlyFocusedNode = target;
          }
        } else {
          // escaped! pull it back in to where it just left
          event.stopImmediatePropagation();

          // focus will escape if the MRU node had a positive tab index and user tried to nav forward;
          //  it will also escape if the MRU node had a 0 tab index and user tried to nav backward
          //  toward a node with a positive tab index
          var nextNode; // next node to focus, if we find one
          var navAcrossContainers = true;
          if (state.mostRecentlyFocusedNode) {
            if (getTabIndex(state.mostRecentlyFocusedNode) > 0) {
              // MRU container index must be >=0 otherwise we wouldn't have it as an MRU node...
              var mruContainerIdx = findContainerIndex(state.mostRecentlyFocusedNode);
              // there MAY not be any tabbable nodes in the container if there are at least 2 containers
              //  and the MRU node is focusable but not tabbable (focus-trap requires at least 1 container
              //  with at least one tabbable node in order to function, so this could be the other container
              //  with nothing tabbable in it)
              var tabbableNodes = state.containerGroups[mruContainerIdx].tabbableNodes;
              if (tabbableNodes.length > 0) {
                // MRU tab index MAY not be found if the MRU node is focusable but not tabbable
                var mruTabIdx = tabbableNodes.findIndex(function (node) {
                  return node === state.mostRecentlyFocusedNode;
                });
                if (mruTabIdx >= 0) {
                  if (config.isKeyForward(state.recentNavEvent)) {
                    if (mruTabIdx + 1 < tabbableNodes.length) {
                      nextNode = tabbableNodes[mruTabIdx + 1];
                      navAcrossContainers = false;
                    }
                    // else, don't wrap within the container as focus should move to next/previous
                    //  container
                  } else {
                    if (mruTabIdx - 1 >= 0) {
                      nextNode = tabbableNodes[mruTabIdx - 1];
                      navAcrossContainers = false;
                    }
                    // else, don't wrap within the container as focus should move to next/previous
                    //  container
                  }
                  // else, don't find in container order without considering direction too
                }
              }
              // else, no tabbable nodes in that container (which means we must have at least one other
              //  container with at least one tabbable node in it, otherwise focus-trap would've thrown
              //  an error the last time updateTabbableNodes() was run): find next node among all known
              //  containers
            } else {
              // check to see if there's at least one tabbable node with a positive tab index inside
              //  the trap because focus seems to escape when navigating backward from a tabbable node
              //  with tabindex=0 when this is the case (instead of wrapping to the tabbable node with
              //  the greatest positive tab index like it should)
              if (!state.containerGroups.some(function (g) {
                return g.tabbableNodes.some(function (n) {
                  return getTabIndex(n) > 0;
                });
              })) {
                // no containers with tabbable nodes with positive tab indexes which means the focus
                //  escaped for some other reason and we should just execute the fallback to the
                //  MRU node or initial focus node, if any
                navAcrossContainers = false;
              }
            }
          } else {
            // no MRU node means we're likely in some initial condition when the trap has just
            //  been activated and initial focus hasn't been given yet, in which case we should
            //  fall through to trying to focus the initial focus node, which is what should
            //  happen below at this point in the logic
            navAcrossContainers = false;
          }
          if (navAcrossContainers) {
            nextNode = findNextNavNode({
              // move FROM the MRU node, not event-related node (which will be the node that is
              //  outside the trap causing the focus escape we're trying to fix)
              target: state.mostRecentlyFocusedNode,
              isBackward: config.isKeyBackward(state.recentNavEvent)
            });
          }
          if (nextNode) {
            _tryFocus(nextNode);
          } else {
            _tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
          }
        }
        state.recentNavEvent = undefined; // clear
      };

      // Hijack key nav events on the first and last focusable nodes of the trap,
      // in order to prevent focus from escaping. If it escapes for even a
      // moment it can end up scrolling the page and causing confusion so we
      // kind of need to capture the action at the keydown phase.
      var checkKeyNav = function checkKeyNav(event) {
        var isBackward = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        state.recentNavEvent = event;
        var destinationNode = findNextNavNode({
          event: event,
          isBackward: isBackward
        });
        if (destinationNode) {
          if (isTabEvent(event)) {
            // since tab natively moves focus, we wouldn't have a destination node unless we
            //  were on the edge of a container and had to move to the next/previous edge, in
            //  which case we want to prevent default to keep the browser from moving focus
            //  to where it normally would
            event.preventDefault();
          }
          _tryFocus(destinationNode);
        }
        // else, let the browser take care of [shift+]tab and move the focus
      };
      var checkTabKey = function checkTabKey(event) {
        if (config.isKeyForward(event) || config.isKeyBackward(event)) {
          checkKeyNav(event, config.isKeyBackward(event));
        }
      };

      // we use a different event phase for the Escape key to allow canceling the event and checking for this in escapeDeactivates
      var checkEscapeKey = function checkEscapeKey(event) {
        if (isEscapeEvent(event) && valueOrHandler(config.escapeDeactivates, event) !== false) {
          event.preventDefault();
          trap.deactivate();
        }
      };
      var checkClick = function checkClick(e) {
        var target = getActualTarget(e);
        if (findContainerIndex(target, e) >= 0) {
          return;
        }
        if (valueOrHandler(config.clickOutsideDeactivates, e)) {
          return;
        }
        if (valueOrHandler(config.allowOutsideClick, e)) {
          return;
        }
        e.preventDefault();
        e.stopImmediatePropagation();
      };

      //
      // EVENT LISTENERS
      //

      var addListeners = function addListeners() {
        if (!state.active) {
          return;
        }

        // There can be only one listening focus trap at a time
        activeFocusTraps.activateTrap(trapStack, trap);

        // Delay ensures that the focused element doesn't capture the event
        // that caused the focus trap activation.
        state.delayInitialFocusTimer = config.delayInitialFocus ? delay(function () {
          _tryFocus(getInitialFocusNode());
        }) : _tryFocus(getInitialFocusNode());
        doc.addEventListener('focusin', checkFocusIn, true);
        doc.addEventListener('mousedown', checkPointerDown, {
          capture: true,
          passive: false
        });
        doc.addEventListener('touchstart', checkPointerDown, {
          capture: true,
          passive: false
        });
        doc.addEventListener('click', checkClick, {
          capture: true,
          passive: false
        });
        doc.addEventListener('keydown', checkTabKey, {
          capture: true,
          passive: false
        });
        doc.addEventListener('keydown', checkEscapeKey);
        return trap;
      };
      var removeListeners = function removeListeners() {
        if (!state.active) {
          return;
        }
        doc.removeEventListener('focusin', checkFocusIn, true);
        doc.removeEventListener('mousedown', checkPointerDown, true);
        doc.removeEventListener('touchstart', checkPointerDown, true);
        doc.removeEventListener('click', checkClick, true);
        doc.removeEventListener('keydown', checkTabKey, true);
        doc.removeEventListener('keydown', checkEscapeKey);
        return trap;
      };

      //
      // MUTATION OBSERVER
      //

      var checkDomRemoval = function checkDomRemoval(mutations) {
        var isFocusedNodeRemoved = mutations.some(function (mutation) {
          var removedNodes = Array.from(mutation.removedNodes);
          return removedNodes.some(function (node) {
            return node === state.mostRecentlyFocusedNode;
          });
        });

        // If the currently focused is removed then browsers will move focus to the
        // <body> element. If this happens, try to move focus back into the trap.
        if (isFocusedNodeRemoved) {
          _tryFocus(getInitialFocusNode());
        }
      };

      // Use MutationObserver - if supported - to detect if focused node is removed
      // from the DOM.
      var mutationObserver = typeof window !== 'undefined' && 'MutationObserver' in window ? new MutationObserver(checkDomRemoval) : undefined;
      var updateObservedNodes = function updateObservedNodes() {
        if (!mutationObserver) {
          return;
        }
        mutationObserver.disconnect();
        if (state.active && !state.paused) {
          state.containers.map(function (container) {
            mutationObserver.observe(container, {
              subtree: true,
              childList: true
            });
          });
        }
      };

      //
      // TRAP DEFINITION
      //

      trap = {
        get active() {
          return state.active;
        },
        get paused() {
          return state.paused;
        },
        activate: function activate(activateOptions) {
          if (state.active) {
            return this;
          }
          var onActivate = getOption(activateOptions, 'onActivate');
          var onPostActivate = getOption(activateOptions, 'onPostActivate');
          var checkCanFocusTrap = getOption(activateOptions, 'checkCanFocusTrap');
          if (!checkCanFocusTrap) {
            updateTabbableNodes();
          }
          state.active = true;
          state.paused = false;
          state.nodeFocusedBeforeActivation = doc.activeElement;
          onActivate === null || onActivate === undefined || onActivate();
          var finishActivation = function finishActivation() {
            if (checkCanFocusTrap) {
              updateTabbableNodes();
            }
            addListeners();
            updateObservedNodes();
            onPostActivate === null || onPostActivate === undefined || onPostActivate();
          };
          if (checkCanFocusTrap) {
            checkCanFocusTrap(state.containers.concat()).then(finishActivation, finishActivation);
            return this;
          }
          finishActivation();
          return this;
        },
        deactivate: function deactivate(deactivateOptions) {
          if (!state.active) {
            return this;
          }
          var options = _objectSpread2({
            onDeactivate: config.onDeactivate,
            onPostDeactivate: config.onPostDeactivate,
            checkCanReturnFocus: config.checkCanReturnFocus
          }, deactivateOptions);
          clearTimeout(state.delayInitialFocusTimer); // noop if undefined
          state.delayInitialFocusTimer = undefined;
          removeListeners();
          state.active = false;
          state.paused = false;
          updateObservedNodes();
          activeFocusTraps.deactivateTrap(trapStack, trap);
          var onDeactivate = getOption(options, 'onDeactivate');
          var onPostDeactivate = getOption(options, 'onPostDeactivate');
          var checkCanReturnFocus = getOption(options, 'checkCanReturnFocus');
          var returnFocus = getOption(options, 'returnFocus', 'returnFocusOnDeactivate');
          onDeactivate === null || onDeactivate === undefined || onDeactivate();
          var finishDeactivation = function finishDeactivation() {
            delay(function () {
              if (returnFocus) {
                _tryFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation));
              }
              onPostDeactivate === null || onPostDeactivate === undefined || onPostDeactivate();
            });
          };
          if (returnFocus && checkCanReturnFocus) {
            checkCanReturnFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation)).then(finishDeactivation, finishDeactivation);
            return this;
          }
          finishDeactivation();
          return this;
        },
        pause: function pause(pauseOptions) {
          if (!state.active) {
            return this;
          }
          state.manuallyPaused = true;
          return this._setPausedState(true, pauseOptions);
        },
        unpause: function unpause(unpauseOptions) {
          if (!state.active) {
            return this;
          }
          state.manuallyPaused = false;
          if (trapStack[trapStack.length - 1] !== this) {
            return this;
          }
          return this._setPausedState(false, unpauseOptions);
        },
        updateContainerElements: function updateContainerElements(containerElements) {
          var elementsAsArray = [].concat(containerElements).filter(Boolean);
          state.containers = elementsAsArray.map(function (element) {
            return typeof element === 'string' ? doc.querySelector(element) : element;
          });
          if (state.active) {
            updateTabbableNodes();
          }
          updateObservedNodes();
          return this;
        }
      };
      Object.defineProperties(trap, {
        _isManuallyPaused: {
          value: function value() {
            return state.manuallyPaused;
          }
        },
        _setPausedState: {
          value: function value(paused, options) {
            if (state.paused === paused) {
              return this;
            }
            state.paused = paused;
            if (paused) {
              var onPause = getOption(options, 'onPause');
              var onPostPause = getOption(options, 'onPostPause');
              onPause === null || onPause === undefined || onPause();
              removeListeners();
              updateObservedNodes();
              onPostPause === null || onPostPause === undefined || onPostPause();
            } else {
              var onUnpause = getOption(options, 'onUnpause');
              var onPostUnpause = getOption(options, 'onPostUnpause');
              onUnpause === null || onUnpause === undefined || onUnpause();
              updateTabbableNodes();
              addListeners();
              updateObservedNodes();
              onPostUnpause === null || onPostUnpause === undefined || onPostUnpause();
            }
            return this;
          }
        }
      });

      // initialize container elements
      trap.updateContainerElements(elements);
      return trap;
    };

    class FocusTrap {
        constructor({ element, dotNetObject, allowOutsideClick, clickOutsideDeactivates, trigger, }) {
            this.deactivate = () => {
                this.trap.deactivate();
            };
            this.element = element;
            this.dotNetObject = dotNetObject;
            this.allowOutsideClick = allowOutsideClick;
            this.clickOutsideDeactivates = clickOutsideDeactivates;
            this.trigger = trigger;
            const trap = createFocusTrap(element, {
                onDeactivate: () => {
                    dotNetObject.invokeMethodAsync("Deactivate");
                },
                allowOutsideClick: (event) => {
                    if (clickOutsideDeactivates) {
                        return true;
                    }
                    if (!(event.target instanceof HTMLElement)) {
                        return allowOutsideClick;
                    }
                    if (allowOutsideClick) {
                        return true;
                    }
                    return event.target === trigger;
                },
                clickOutsideDeactivates: (event) => {
                    if (!(event.target instanceof HTMLElement)) {
                        return clickOutsideDeactivates;
                    }
                    return event.target !== trigger && clickOutsideDeactivates;
                },
            });
            trap.activate();
            this.trap = trap;
        }
    }

    /**
     * Custom positioning reference element.
     * @see https://floating-ui.com/docs/virtual-elements
     */

    const min = Math.min;
    const max = Math.max;
    const round = Math.round;
    const floor = Math.floor;
    const createCoords = v => ({
      x: v,
      y: v
    });
    const oppositeSideMap = {
      left: 'right',
      right: 'left',
      bottom: 'top',
      top: 'bottom'
    };
    const oppositeAlignmentMap = {
      start: 'end',
      end: 'start'
    };
    function clamp(start, value, end) {
      return max(start, min(value, end));
    }
    function evaluate(value, param) {
      return typeof value === 'function' ? value(param) : value;
    }
    function getSide(placement) {
      return placement.split('-')[0];
    }
    function getAlignment(placement) {
      return placement.split('-')[1];
    }
    function getOppositeAxis(axis) {
      return axis === 'x' ? 'y' : 'x';
    }
    function getAxisLength(axis) {
      return axis === 'y' ? 'height' : 'width';
    }
    function getSideAxis(placement) {
      return ['top', 'bottom'].includes(getSide(placement)) ? 'y' : 'x';
    }
    function getAlignmentAxis(placement) {
      return getOppositeAxis(getSideAxis(placement));
    }
    function getAlignmentSides(placement, rects, rtl) {
      if (rtl === void 0) {
        rtl = false;
      }
      const alignment = getAlignment(placement);
      const alignmentAxis = getAlignmentAxis(placement);
      const length = getAxisLength(alignmentAxis);
      let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
      if (rects.reference[length] > rects.floating[length]) {
        mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
      }
      return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
    }
    function getExpandedPlacements(placement) {
      const oppositePlacement = getOppositePlacement(placement);
      return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
    }
    function getOppositeAlignmentPlacement(placement) {
      return placement.replace(/start|end/g, alignment => oppositeAlignmentMap[alignment]);
    }
    function getSideList(side, isStart, rtl) {
      const lr = ['left', 'right'];
      const rl = ['right', 'left'];
      const tb = ['top', 'bottom'];
      const bt = ['bottom', 'top'];
      switch (side) {
        case 'top':
        case 'bottom':
          if (rtl) return isStart ? rl : lr;
          return isStart ? lr : rl;
        case 'left':
        case 'right':
          return isStart ? tb : bt;
        default:
          return [];
      }
    }
    function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
      const alignment = getAlignment(placement);
      let list = getSideList(getSide(placement), direction === 'start', rtl);
      if (alignment) {
        list = list.map(side => side + "-" + alignment);
        if (flipAlignment) {
          list = list.concat(list.map(getOppositeAlignmentPlacement));
        }
      }
      return list;
    }
    function getOppositePlacement(placement) {
      return placement.replace(/left|right|bottom|top/g, side => oppositeSideMap[side]);
    }
    function expandPaddingObject(padding) {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        ...padding
      };
    }
    function getPaddingObject(padding) {
      return typeof padding !== 'number' ? expandPaddingObject(padding) : {
        top: padding,
        right: padding,
        bottom: padding,
        left: padding
      };
    }
    function rectToClientRect(rect) {
      const {
        x,
        y,
        width,
        height
      } = rect;
      return {
        width,
        height,
        top: y,
        left: x,
        right: x + width,
        bottom: y + height,
        x,
        y
      };
    }

    function computeCoordsFromPlacement(_ref, placement, rtl) {
      let {
        reference,
        floating
      } = _ref;
      const sideAxis = getSideAxis(placement);
      const alignmentAxis = getAlignmentAxis(placement);
      const alignLength = getAxisLength(alignmentAxis);
      const side = getSide(placement);
      const isVertical = sideAxis === 'y';
      const commonX = reference.x + reference.width / 2 - floating.width / 2;
      const commonY = reference.y + reference.height / 2 - floating.height / 2;
      const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
      let coords;
      switch (side) {
        case 'top':
          coords = {
            x: commonX,
            y: reference.y - floating.height
          };
          break;
        case 'bottom':
          coords = {
            x: commonX,
            y: reference.y + reference.height
          };
          break;
        case 'right':
          coords = {
            x: reference.x + reference.width,
            y: commonY
          };
          break;
        case 'left':
          coords = {
            x: reference.x - floating.width,
            y: commonY
          };
          break;
        default:
          coords = {
            x: reference.x,
            y: reference.y
          };
      }
      switch (getAlignment(placement)) {
        case 'start':
          coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
          break;
        case 'end':
          coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
          break;
      }
      return coords;
    }

    /**
     * Computes the `x` and `y` coordinates that will place the floating element
     * next to a given reference element.
     *
     * This export does not have any `platform` interface logic. You will need to
     * write one for the platform you are using Floating UI with.
     */
    const computePosition$1 = async (reference, floating, config) => {
      const {
        placement = 'bottom',
        strategy = 'absolute',
        middleware = [],
        platform
      } = config;
      const validMiddleware = middleware.filter(Boolean);
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
      let rects = await platform.getElementRects({
        reference,
        floating,
        strategy
      });
      let {
        x,
        y
      } = computeCoordsFromPlacement(rects, placement, rtl);
      let statefulPlacement = placement;
      let middlewareData = {};
      let resetCount = 0;
      for (let i = 0; i < validMiddleware.length; i++) {
        const {
          name,
          fn
        } = validMiddleware[i];
        const {
          x: nextX,
          y: nextY,
          data,
          reset
        } = await fn({
          x,
          y,
          initialPlacement: placement,
          placement: statefulPlacement,
          strategy,
          middlewareData,
          rects,
          platform,
          elements: {
            reference,
            floating
          }
        });
        x = nextX != null ? nextX : x;
        y = nextY != null ? nextY : y;
        middlewareData = {
          ...middlewareData,
          [name]: {
            ...middlewareData[name],
            ...data
          }
        };
        if (reset && resetCount <= 50) {
          resetCount++;
          if (typeof reset === 'object') {
            if (reset.placement) {
              statefulPlacement = reset.placement;
            }
            if (reset.rects) {
              rects = reset.rects === true ? await platform.getElementRects({
                reference,
                floating,
                strategy
              }) : reset.rects;
            }
            ({
              x,
              y
            } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
          }
          i = -1;
        }
      }
      return {
        x,
        y,
        placement: statefulPlacement,
        strategy,
        middlewareData
      };
    };

    /**
     * Resolves with an object of overflow side offsets that determine how much the
     * element is overflowing a given clipping boundary on each side.
     * - positive = overflowing the boundary by that number of pixels
     * - negative = how many pixels left before it will overflow
     * - 0 = lies flush with the boundary
     * @see https://floating-ui.com/docs/detectOverflow
     */
    async function detectOverflow(state, options) {
      var _await$platform$isEle;
      if (options === void 0) {
        options = {};
      }
      const {
        x,
        y,
        platform,
        rects,
        elements,
        strategy
      } = state;
      const {
        boundary = 'clippingAncestors',
        rootBoundary = 'viewport',
        elementContext = 'floating',
        altBoundary = false,
        padding = 0
      } = evaluate(options, state);
      const paddingObject = getPaddingObject(padding);
      const altContext = elementContext === 'floating' ? 'reference' : 'floating';
      const element = elements[altBoundary ? altContext : elementContext];
      const clippingClientRect = rectToClientRect(await platform.getClippingRect({
        element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
        boundary,
        rootBoundary,
        strategy
      }));
      const rect = elementContext === 'floating' ? {
        x,
        y,
        width: rects.floating.width,
        height: rects.floating.height
      } : rects.reference;
      const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
      const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) ? (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
        x: 1,
        y: 1
      } : {
        x: 1,
        y: 1
      };
      const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
        elements,
        rect,
        offsetParent,
        strategy
      }) : rect);
      return {
        top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
        bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
        left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
        right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
      };
    }

    /**
     * Provides data to position an inner element of the floating element so that it
     * appears centered to the reference element.
     * @see https://floating-ui.com/docs/arrow
     */
    const arrow$1 = options => ({
      name: 'arrow',
      options,
      async fn(state) {
        const {
          x,
          y,
          placement,
          rects,
          platform,
          elements,
          middlewareData
        } = state;
        // Since `element` is required, we don't Partial<> the type.
        const {
          element,
          padding = 0
        } = evaluate(options, state) || {};
        if (element == null) {
          return {};
        }
        const paddingObject = getPaddingObject(padding);
        const coords = {
          x,
          y
        };
        const axis = getAlignmentAxis(placement);
        const length = getAxisLength(axis);
        const arrowDimensions = await platform.getDimensions(element);
        const isYAxis = axis === 'y';
        const minProp = isYAxis ? 'top' : 'left';
        const maxProp = isYAxis ? 'bottom' : 'right';
        const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
        const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
        const startDiff = coords[axis] - rects.reference[axis];
        const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
        let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

        // DOM platform can return `window` as the `offsetParent`.
        if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
          clientSize = elements.floating[clientProp] || rects.floating[length];
        }
        const centerToReference = endDiff / 2 - startDiff / 2;

        // If the padding is large enough that it causes the arrow to no longer be
        // centered, modify the padding so that it is centered.
        const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
        const minPadding = min(paddingObject[minProp], largestPossiblePadding);
        const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);

        // Make sure the arrow doesn't overflow the floating element if the center
        // point is outside the floating element's bounds.
        const min$1 = minPadding;
        const max = clientSize - arrowDimensions[length] - maxPadding;
        const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
        const offset = clamp(min$1, center, max);

        // If the reference is small enough that the arrow's padding causes it to
        // to point to nothing for an aligned placement, adjust the offset of the
        // floating element itself. To ensure `shift()` continues to take action,
        // a single reset is performed when this is true.
        const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
        const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
        return {
          [axis]: coords[axis] + alignmentOffset,
          data: {
            [axis]: offset,
            centerOffset: center - offset - alignmentOffset,
            ...(shouldAddOffset && {
              alignmentOffset
            })
          },
          reset: shouldAddOffset
        };
      }
    });

    /**
     * Optimizes the visibility of the floating element by flipping the `placement`
     * in order to keep it in view when the preferred placement(s) will overflow the
     * clipping boundary. Alternative to `autoPlacement`.
     * @see https://floating-ui.com/docs/flip
     */
    const flip$1 = function (options) {
      if (options === void 0) {
        options = {};
      }
      return {
        name: 'flip',
        options,
        async fn(state) {
          var _middlewareData$arrow, _middlewareData$flip;
          const {
            placement,
            middlewareData,
            rects,
            initialPlacement,
            platform,
            elements
          } = state;
          const {
            mainAxis: checkMainAxis = true,
            crossAxis: checkCrossAxis = true,
            fallbackPlacements: specifiedFallbackPlacements,
            fallbackStrategy = 'bestFit',
            fallbackAxisSideDirection = 'none',
            flipAlignment = true,
            ...detectOverflowOptions
          } = evaluate(options, state);

          // If a reset by the arrow was caused due to an alignment offset being
          // added, we should skip any logic now since `flip()` has already done its
          // work.
          // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
          if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
            return {};
          }
          const side = getSide(placement);
          const initialSideAxis = getSideAxis(initialPlacement);
          const isBasePlacement = getSide(initialPlacement) === initialPlacement;
          const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
          const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
          const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== 'none';
          if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
            fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
          }
          const placements = [initialPlacement, ...fallbackPlacements];
          const overflow = await detectOverflow(state, detectOverflowOptions);
          const overflows = [];
          let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
          if (checkMainAxis) {
            overflows.push(overflow[side]);
          }
          if (checkCrossAxis) {
            const sides = getAlignmentSides(placement, rects, rtl);
            overflows.push(overflow[sides[0]], overflow[sides[1]]);
          }
          overflowsData = [...overflowsData, {
            placement,
            overflows
          }];

          // One or more sides is overflowing.
          if (!overflows.every(side => side <= 0)) {
            var _middlewareData$flip2, _overflowsData$filter;
            const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
            const nextPlacement = placements[nextIndex];
            if (nextPlacement) {
              // Try next placement and re-run the lifecycle.
              return {
                data: {
                  index: nextIndex,
                  overflows: overflowsData
                },
                reset: {
                  placement: nextPlacement
                }
              };
            }

            // First, find the candidates that fit on the mainAxis side of overflow,
            // then find the placement that fits the best on the main crossAxis side.
            let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

            // Otherwise fallback.
            if (!resetPlacement) {
              switch (fallbackStrategy) {
                case 'bestFit':
                  {
                    var _overflowsData$filter2;
                    const placement = (_overflowsData$filter2 = overflowsData.filter(d => {
                      if (hasFallbackAxisSideDirection) {
                        const currentSideAxis = getSideAxis(d.placement);
                        return currentSideAxis === initialSideAxis ||
                        // Create a bias to the `y` side axis due to horizontal
                        // reading directions favoring greater width.
                        currentSideAxis === 'y';
                      }
                      return true;
                    }).map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                    if (placement) {
                      resetPlacement = placement;
                    }
                    break;
                  }
                case 'initialPlacement':
                  resetPlacement = initialPlacement;
                  break;
              }
            }
            if (placement !== resetPlacement) {
              return {
                reset: {
                  placement: resetPlacement
                }
              };
            }
          }
          return {};
        }
      };
    };

    // For type backwards-compatibility, the `OffsetOptions` type was also
    // Derivable.

    async function convertValueToCoords(state, options) {
      const {
        placement,
        platform,
        elements
      } = state;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const side = getSide(placement);
      const alignment = getAlignment(placement);
      const isVertical = getSideAxis(placement) === 'y';
      const mainAxisMulti = ['left', 'top'].includes(side) ? -1 : 1;
      const crossAxisMulti = rtl && isVertical ? -1 : 1;
      const rawValue = evaluate(options, state);

      // eslint-disable-next-line prefer-const
      let {
        mainAxis,
        crossAxis,
        alignmentAxis
      } = typeof rawValue === 'number' ? {
        mainAxis: rawValue,
        crossAxis: 0,
        alignmentAxis: null
      } : {
        mainAxis: rawValue.mainAxis || 0,
        crossAxis: rawValue.crossAxis || 0,
        alignmentAxis: rawValue.alignmentAxis
      };
      if (alignment && typeof alignmentAxis === 'number') {
        crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
      }
      return isVertical ? {
        x: crossAxis * crossAxisMulti,
        y: mainAxis * mainAxisMulti
      } : {
        x: mainAxis * mainAxisMulti,
        y: crossAxis * crossAxisMulti
      };
    }

    /**
     * Modifies the placement by translating the floating element along the
     * specified axes.
     * A number (shorthand for `mainAxis` or distance), or an axes configuration
     * object may be passed.
     * @see https://floating-ui.com/docs/offset
     */
    const offset$1 = function (options) {
      if (options === void 0) {
        options = 0;
      }
      return {
        name: 'offset',
        options,
        async fn(state) {
          var _middlewareData$offse, _middlewareData$arrow;
          const {
            x,
            y,
            placement,
            middlewareData
          } = state;
          const diffCoords = await convertValueToCoords(state, options);

          // If the placement is the same and the arrow caused an alignment offset
          // then we don't need to change the positioning coordinates.
          if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
            return {};
          }
          return {
            x: x + diffCoords.x,
            y: y + diffCoords.y,
            data: {
              ...diffCoords,
              placement
            }
          };
        }
      };
    };

    /**
     * Optimizes the visibility of the floating element by shifting it in order to
     * keep it in view when it will overflow the clipping boundary.
     * @see https://floating-ui.com/docs/shift
     */
    const shift$1 = function (options) {
      if (options === void 0) {
        options = {};
      }
      return {
        name: 'shift',
        options,
        async fn(state) {
          const {
            x,
            y,
            placement
          } = state;
          const {
            mainAxis: checkMainAxis = true,
            crossAxis: checkCrossAxis = false,
            limiter = {
              fn: _ref => {
                let {
                  x,
                  y
                } = _ref;
                return {
                  x,
                  y
                };
              }
            },
            ...detectOverflowOptions
          } = evaluate(options, state);
          const coords = {
            x,
            y
          };
          const overflow = await detectOverflow(state, detectOverflowOptions);
          const crossAxis = getSideAxis(getSide(placement));
          const mainAxis = getOppositeAxis(crossAxis);
          let mainAxisCoord = coords[mainAxis];
          let crossAxisCoord = coords[crossAxis];
          if (checkMainAxis) {
            const minSide = mainAxis === 'y' ? 'top' : 'left';
            const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
            const min = mainAxisCoord + overflow[minSide];
            const max = mainAxisCoord - overflow[maxSide];
            mainAxisCoord = clamp(min, mainAxisCoord, max);
          }
          if (checkCrossAxis) {
            const minSide = crossAxis === 'y' ? 'top' : 'left';
            const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
            const min = crossAxisCoord + overflow[minSide];
            const max = crossAxisCoord - overflow[maxSide];
            crossAxisCoord = clamp(min, crossAxisCoord, max);
          }
          const limitedCoords = limiter.fn({
            ...state,
            [mainAxis]: mainAxisCoord,
            [crossAxis]: crossAxisCoord
          });
          return {
            ...limitedCoords,
            data: {
              x: limitedCoords.x - x,
              y: limitedCoords.y - y,
              enabled: {
                [mainAxis]: checkMainAxis,
                [crossAxis]: checkCrossAxis
              }
            }
          };
        }
      };
    };

    function hasWindow() {
      return typeof window !== 'undefined';
    }
    function getNodeName(node) {
      if (isNode(node)) {
        return (node.nodeName || '').toLowerCase();
      }
      // Mocked nodes in testing environments may not be instances of Node. By
      // returning `#document` an infinite loop won't occur.
      // https://github.com/floating-ui/floating-ui/issues/2317
      return '#document';
    }
    function getWindow(node) {
      var _node$ownerDocument;
      return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
    }
    function getDocumentElement(node) {
      var _ref;
      return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
    }
    function isNode(value) {
      if (!hasWindow()) {
        return false;
      }
      return value instanceof Node || value instanceof getWindow(value).Node;
    }
    function isElement(value) {
      if (!hasWindow()) {
        return false;
      }
      return value instanceof Element || value instanceof getWindow(value).Element;
    }
    function isHTMLElement(value) {
      if (!hasWindow()) {
        return false;
      }
      return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
    }
    function isShadowRoot(value) {
      if (!hasWindow() || typeof ShadowRoot === 'undefined') {
        return false;
      }
      return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
    }
    function isOverflowElement(element) {
      const {
        overflow,
        overflowX,
        overflowY,
        display
      } = getComputedStyle$1(element);
      return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !['inline', 'contents'].includes(display);
    }
    function isTableElement(element) {
      return ['table', 'td', 'th'].includes(getNodeName(element));
    }
    function isTopLayer(element) {
      return [':popover-open', ':modal'].some(selector => {
        try {
          return element.matches(selector);
        } catch (e) {
          return false;
        }
      });
    }
    function isContainingBlock(elementOrCss) {
      const webkit = isWebKit();
      const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;

      // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
      // https://drafts.csswg.org/css-transforms-2/#individual-transforms
      return ['transform', 'translate', 'scale', 'rotate', 'perspective'].some(value => css[value] ? css[value] !== 'none' : false) || (css.containerType ? css.containerType !== 'normal' : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== 'none' : false) || !webkit && (css.filter ? css.filter !== 'none' : false) || ['transform', 'translate', 'scale', 'rotate', 'perspective', 'filter'].some(value => (css.willChange || '').includes(value)) || ['paint', 'layout', 'strict', 'content'].some(value => (css.contain || '').includes(value));
    }
    function getContainingBlock(element) {
      let currentNode = getParentNode(element);
      while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
        if (isContainingBlock(currentNode)) {
          return currentNode;
        } else if (isTopLayer(currentNode)) {
          return null;
        }
        currentNode = getParentNode(currentNode);
      }
      return null;
    }
    function isWebKit() {
      if (typeof CSS === 'undefined' || !CSS.supports) return false;
      return CSS.supports('-webkit-backdrop-filter', 'none');
    }
    function isLastTraversableNode(node) {
      return ['html', 'body', '#document'].includes(getNodeName(node));
    }
    function getComputedStyle$1(element) {
      return getWindow(element).getComputedStyle(element);
    }
    function getNodeScroll(element) {
      if (isElement(element)) {
        return {
          scrollLeft: element.scrollLeft,
          scrollTop: element.scrollTop
        };
      }
      return {
        scrollLeft: element.scrollX,
        scrollTop: element.scrollY
      };
    }
    function getParentNode(node) {
      if (getNodeName(node) === 'html') {
        return node;
      }
      const result =
      // Step into the shadow DOM of the parent of a slotted node.
      node.assignedSlot ||
      // DOM Element detected.
      node.parentNode ||
      // ShadowRoot detected.
      isShadowRoot(node) && node.host ||
      // Fallback.
      getDocumentElement(node);
      return isShadowRoot(result) ? result.host : result;
    }
    function getNearestOverflowAncestor(node) {
      const parentNode = getParentNode(node);
      if (isLastTraversableNode(parentNode)) {
        return node.ownerDocument ? node.ownerDocument.body : node.body;
      }
      if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
        return parentNode;
      }
      return getNearestOverflowAncestor(parentNode);
    }
    function getOverflowAncestors(node, list, traverseIframes) {
      var _node$ownerDocument2;
      if (list === void 0) {
        list = [];
      }
      if (traverseIframes === void 0) {
        traverseIframes = true;
      }
      const scrollableAncestor = getNearestOverflowAncestor(node);
      const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
      const win = getWindow(scrollableAncestor);
      if (isBody) {
        const frameElement = getFrameElement(win);
        return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
      }
      return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
    }
    function getFrameElement(win) {
      return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
    }

    function getCssDimensions(element) {
      const css = getComputedStyle$1(element);
      // In testing environments, the `width` and `height` properties are empty
      // strings for SVG elements, returning NaN. Fallback to `0` in this case.
      let width = parseFloat(css.width) || 0;
      let height = parseFloat(css.height) || 0;
      const hasOffset = isHTMLElement(element);
      const offsetWidth = hasOffset ? element.offsetWidth : width;
      const offsetHeight = hasOffset ? element.offsetHeight : height;
      const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
      if (shouldFallback) {
        width = offsetWidth;
        height = offsetHeight;
      }
      return {
        width,
        height,
        $: shouldFallback
      };
    }

    function unwrapElement(element) {
      return !isElement(element) ? element.contextElement : element;
    }

    function getScale(element) {
      const domElement = unwrapElement(element);
      if (!isHTMLElement(domElement)) {
        return createCoords(1);
      }
      const rect = domElement.getBoundingClientRect();
      const {
        width,
        height,
        $
      } = getCssDimensions(domElement);
      let x = ($ ? round(rect.width) : rect.width) / width;
      let y = ($ ? round(rect.height) : rect.height) / height;

      // 0, NaN, or Infinity should always fallback to 1.

      if (!x || !Number.isFinite(x)) {
        x = 1;
      }
      if (!y || !Number.isFinite(y)) {
        y = 1;
      }
      return {
        x,
        y
      };
    }

    const noOffsets = /*#__PURE__*/createCoords(0);
    function getVisualOffsets(element) {
      const win = getWindow(element);
      if (!isWebKit() || !win.visualViewport) {
        return noOffsets;
      }
      return {
        x: win.visualViewport.offsetLeft,
        y: win.visualViewport.offsetTop
      };
    }
    function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
      if (isFixed === void 0) {
        isFixed = false;
      }
      if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
        return false;
      }
      return isFixed;
    }

    function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
      if (includeScale === void 0) {
        includeScale = false;
      }
      if (isFixedStrategy === void 0) {
        isFixedStrategy = false;
      }
      const clientRect = element.getBoundingClientRect();
      const domElement = unwrapElement(element);
      let scale = createCoords(1);
      if (includeScale) {
        if (offsetParent) {
          if (isElement(offsetParent)) {
            scale = getScale(offsetParent);
          }
        } else {
          scale = getScale(element);
        }
      }
      const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
      let x = (clientRect.left + visualOffsets.x) / scale.x;
      let y = (clientRect.top + visualOffsets.y) / scale.y;
      let width = clientRect.width / scale.x;
      let height = clientRect.height / scale.y;
      if (domElement) {
        const win = getWindow(domElement);
        const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
        let currentWin = win;
        let currentIFrame = getFrameElement(currentWin);
        while (currentIFrame && offsetParent && offsetWin !== currentWin) {
          const iframeScale = getScale(currentIFrame);
          const iframeRect = currentIFrame.getBoundingClientRect();
          const css = getComputedStyle$1(currentIFrame);
          const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
          const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
          x *= iframeScale.x;
          y *= iframeScale.y;
          width *= iframeScale.x;
          height *= iframeScale.y;
          x += left;
          y += top;
          currentWin = getWindow(currentIFrame);
          currentIFrame = getFrameElement(currentWin);
        }
      }
      return rectToClientRect({
        width,
        height,
        x,
        y
      });
    }

    // If <html> has a CSS width greater than the viewport, then this will be
    // incorrect for RTL.
    function getWindowScrollBarX(element, rect) {
      const leftScroll = getNodeScroll(element).scrollLeft;
      if (!rect) {
        return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
      }
      return rect.left + leftScroll;
    }

    function getHTMLOffset(documentElement, scroll, ignoreScrollbarX) {
      if (ignoreScrollbarX === void 0) {
        ignoreScrollbarX = false;
      }
      const htmlRect = documentElement.getBoundingClientRect();
      const x = htmlRect.left + scroll.scrollLeft - (ignoreScrollbarX ? 0 :
      // RTL <body> scrollbar.
      getWindowScrollBarX(documentElement, htmlRect));
      const y = htmlRect.top + scroll.scrollTop;
      return {
        x,
        y
      };
    }

    function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
      let {
        elements,
        rect,
        offsetParent,
        strategy
      } = _ref;
      const isFixed = strategy === 'fixed';
      const documentElement = getDocumentElement(offsetParent);
      const topLayer = elements ? isTopLayer(elements.floating) : false;
      if (offsetParent === documentElement || topLayer && isFixed) {
        return rect;
      }
      let scroll = {
        scrollLeft: 0,
        scrollTop: 0
      };
      let scale = createCoords(1);
      const offsets = createCoords(0);
      const isOffsetParentAnElement = isHTMLElement(offsetParent);
      if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
        if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
          scroll = getNodeScroll(offsetParent);
        }
        if (isHTMLElement(offsetParent)) {
          const offsetRect = getBoundingClientRect(offsetParent);
          scale = getScale(offsetParent);
          offsets.x = offsetRect.x + offsetParent.clientLeft;
          offsets.y = offsetRect.y + offsetParent.clientTop;
        }
      }
      const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll, true) : createCoords(0);
      return {
        width: rect.width * scale.x,
        height: rect.height * scale.y,
        x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
        y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
      };
    }

    function getClientRects(element) {
      return Array.from(element.getClientRects());
    }

    // Gets the entire size of the scrollable document area, even extending outside
    // of the `<html>` and `<body>` rect bounds if horizontally scrollable.
    function getDocumentRect(element) {
      const html = getDocumentElement(element);
      const scroll = getNodeScroll(element);
      const body = element.ownerDocument.body;
      const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
      const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
      let x = -scroll.scrollLeft + getWindowScrollBarX(element);
      const y = -scroll.scrollTop;
      if (getComputedStyle$1(body).direction === 'rtl') {
        x += max(html.clientWidth, body.clientWidth) - width;
      }
      return {
        width,
        height,
        x,
        y
      };
    }

    function getViewportRect(element, strategy) {
      const win = getWindow(element);
      const html = getDocumentElement(element);
      const visualViewport = win.visualViewport;
      let width = html.clientWidth;
      let height = html.clientHeight;
      let x = 0;
      let y = 0;
      if (visualViewport) {
        width = visualViewport.width;
        height = visualViewport.height;
        const visualViewportBased = isWebKit();
        if (!visualViewportBased || visualViewportBased && strategy === 'fixed') {
          x = visualViewport.offsetLeft;
          y = visualViewport.offsetTop;
        }
      }
      return {
        width,
        height,
        x,
        y
      };
    }

    // Returns the inner client rect, subtracting scrollbars if present.
    function getInnerBoundingClientRect(element, strategy) {
      const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
      const top = clientRect.top + element.clientTop;
      const left = clientRect.left + element.clientLeft;
      const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
      const width = element.clientWidth * scale.x;
      const height = element.clientHeight * scale.y;
      const x = left * scale.x;
      const y = top * scale.y;
      return {
        width,
        height,
        x,
        y
      };
    }
    function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
      let rect;
      if (clippingAncestor === 'viewport') {
        rect = getViewportRect(element, strategy);
      } else if (clippingAncestor === 'document') {
        rect = getDocumentRect(getDocumentElement(element));
      } else if (isElement(clippingAncestor)) {
        rect = getInnerBoundingClientRect(clippingAncestor, strategy);
      } else {
        const visualOffsets = getVisualOffsets(element);
        rect = {
          x: clippingAncestor.x - visualOffsets.x,
          y: clippingAncestor.y - visualOffsets.y,
          width: clippingAncestor.width,
          height: clippingAncestor.height
        };
      }
      return rectToClientRect(rect);
    }
    function hasFixedPositionAncestor(element, stopNode) {
      const parentNode = getParentNode(element);
      if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
        return false;
      }
      return getComputedStyle$1(parentNode).position === 'fixed' || hasFixedPositionAncestor(parentNode, stopNode);
    }

    // A "clipping ancestor" is an `overflow` element with the characteristic of
    // clipping (or hiding) child elements. This returns all clipping ancestors
    // of the given element up the tree.
    function getClippingElementAncestors(element, cache) {
      const cachedResult = cache.get(element);
      if (cachedResult) {
        return cachedResult;
      }
      let result = getOverflowAncestors(element, [], false).filter(el => isElement(el) && getNodeName(el) !== 'body');
      let currentContainingBlockComputedStyle = null;
      const elementIsFixed = getComputedStyle$1(element).position === 'fixed';
      let currentNode = elementIsFixed ? getParentNode(element) : element;

      // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
      while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
        const computedStyle = getComputedStyle$1(currentNode);
        const currentNodeIsContaining = isContainingBlock(currentNode);
        if (!currentNodeIsContaining && computedStyle.position === 'fixed') {
          currentContainingBlockComputedStyle = null;
        }
        const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && ['absolute', 'fixed'].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
        if (shouldDropCurrentNode) {
          // Drop non-containing blocks.
          result = result.filter(ancestor => ancestor !== currentNode);
        } else {
          // Record last containing block for next iteration.
          currentContainingBlockComputedStyle = computedStyle;
        }
        currentNode = getParentNode(currentNode);
      }
      cache.set(element, result);
      return result;
    }

    // Gets the maximum area that the element is visible in due to any number of
    // clipping ancestors.
    function getClippingRect(_ref) {
      let {
        element,
        boundary,
        rootBoundary,
        strategy
      } = _ref;
      const elementClippingAncestors = boundary === 'clippingAncestors' ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
      const clippingAncestors = [...elementClippingAncestors, rootBoundary];
      const firstClippingAncestor = clippingAncestors[0];
      const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
        const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
        accRect.top = max(rect.top, accRect.top);
        accRect.right = min(rect.right, accRect.right);
        accRect.bottom = min(rect.bottom, accRect.bottom);
        accRect.left = max(rect.left, accRect.left);
        return accRect;
      }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
      return {
        width: clippingRect.right - clippingRect.left,
        height: clippingRect.bottom - clippingRect.top,
        x: clippingRect.left,
        y: clippingRect.top
      };
    }

    function getDimensions(element) {
      const {
        width,
        height
      } = getCssDimensions(element);
      return {
        width,
        height
      };
    }

    function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
      const isOffsetParentAnElement = isHTMLElement(offsetParent);
      const documentElement = getDocumentElement(offsetParent);
      const isFixed = strategy === 'fixed';
      const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
      let scroll = {
        scrollLeft: 0,
        scrollTop: 0
      };
      const offsets = createCoords(0);
      if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
        if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
          scroll = getNodeScroll(offsetParent);
        }
        if (isOffsetParentAnElement) {
          const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
          offsets.x = offsetRect.x + offsetParent.clientLeft;
          offsets.y = offsetRect.y + offsetParent.clientTop;
        } else if (documentElement) {
          // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
          // Firefox with layout.scrollbar.side = 3 in about:config to test this.
          offsets.x = getWindowScrollBarX(documentElement);
        }
      }
      const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
      const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
      const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
      return {
        x,
        y,
        width: rect.width,
        height: rect.height
      };
    }

    function isStaticPositioned(element) {
      return getComputedStyle$1(element).position === 'static';
    }

    function getTrueOffsetParent(element, polyfill) {
      if (!isHTMLElement(element) || getComputedStyle$1(element).position === 'fixed') {
        return null;
      }
      if (polyfill) {
        return polyfill(element);
      }
      let rawOffsetParent = element.offsetParent;

      // Firefox returns the <html> element as the offsetParent if it's non-static,
      // while Chrome and Safari return the <body> element. The <body> element must
      // be used to perform the correct calculations even if the <html> element is
      // non-static.
      if (getDocumentElement(element) === rawOffsetParent) {
        rawOffsetParent = rawOffsetParent.ownerDocument.body;
      }
      return rawOffsetParent;
    }

    // Gets the closest ancestor positioned element. Handles some edge cases,
    // such as table ancestors and cross browser bugs.
    function getOffsetParent(element, polyfill) {
      const win = getWindow(element);
      if (isTopLayer(element)) {
        return win;
      }
      if (!isHTMLElement(element)) {
        let svgOffsetParent = getParentNode(element);
        while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
          if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
            return svgOffsetParent;
          }
          svgOffsetParent = getParentNode(svgOffsetParent);
        }
        return win;
      }
      let offsetParent = getTrueOffsetParent(element, polyfill);
      while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
        offsetParent = getTrueOffsetParent(offsetParent, polyfill);
      }
      if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
        return win;
      }
      return offsetParent || getContainingBlock(element) || win;
    }

    const getElementRects = async function (data) {
      const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
      const getDimensionsFn = this.getDimensions;
      const floatingDimensions = await getDimensionsFn(data.floating);
      return {
        reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
        floating: {
          x: 0,
          y: 0,
          width: floatingDimensions.width,
          height: floatingDimensions.height
        }
      };
    };

    function isRTL(element) {
      return getComputedStyle$1(element).direction === 'rtl';
    }

    const platform = {
      convertOffsetParentRelativeRectToViewportRelativeRect,
      getDocumentElement,
      getClippingRect,
      getOffsetParent,
      getElementRects,
      getClientRects,
      getDimensions,
      getScale,
      isElement,
      isRTL
    };

    function rectsAreEqual(a, b) {
      return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
    }

    // https://samthor.au/2021/observing-dom/
    function observeMove(element, onMove) {
      let io = null;
      let timeoutId;
      const root = getDocumentElement(element);
      function cleanup() {
        var _io;
        clearTimeout(timeoutId);
        (_io = io) == null || _io.disconnect();
        io = null;
      }
      function refresh(skip, threshold) {
        if (skip === void 0) {
          skip = false;
        }
        if (threshold === void 0) {
          threshold = 1;
        }
        cleanup();
        const elementRectForRootMargin = element.getBoundingClientRect();
        const {
          left,
          top,
          width,
          height
        } = elementRectForRootMargin;
        if (!skip) {
          onMove();
        }
        if (!width || !height) {
          return;
        }
        const insetTop = floor(top);
        const insetRight = floor(root.clientWidth - (left + width));
        const insetBottom = floor(root.clientHeight - (top + height));
        const insetLeft = floor(left);
        const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
        const options = {
          rootMargin,
          threshold: max(0, min(1, threshold)) || 1
        };
        let isFirstUpdate = true;
        function handleObserve(entries) {
          const ratio = entries[0].intersectionRatio;
          if (ratio !== threshold) {
            if (!isFirstUpdate) {
              return refresh();
            }
            if (!ratio) {
              // If the reference is clipped, the ratio is 0. Throttle the refresh
              // to prevent an infinite loop of updates.
              timeoutId = setTimeout(() => {
                refresh(false, 1e-7);
              }, 1000);
            } else {
              refresh(false, ratio);
            }
          }
          if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
            // It's possible that even though the ratio is reported as 1, the
            // element is not actually fully within the IntersectionObserver's root
            // area anymore. This can happen under performance constraints. This may
            // be a bug in the browser's IntersectionObserver implementation. To
            // work around this, we compare the element's bounding rect now with
            // what it was at the time we created the IntersectionObserver. If they
            // are not equal then the element moved, so we refresh.
            refresh();
          }
          isFirstUpdate = false;
        }

        // Older browsers don't support a `document` as the root and will throw an
        // error.
        try {
          io = new IntersectionObserver(handleObserve, {
            ...options,
            // Handle <iframe>s
            root: root.ownerDocument
          });
        } catch (e) {
          io = new IntersectionObserver(handleObserve, options);
        }
        io.observe(element);
      }
      refresh(true);
      return cleanup;
    }

    /**
     * Automatically updates the position of the floating element when necessary.
     * Should only be called when the floating element is mounted on the DOM or
     * visible on the screen.
     * @returns cleanup function that should be invoked when the floating element is
     * removed from the DOM or hidden from the screen.
     * @see https://floating-ui.com/docs/autoUpdate
     */
    function autoUpdate(reference, floating, update, options) {
      if (options === void 0) {
        options = {};
      }
      const {
        ancestorScroll = true,
        ancestorResize = true,
        elementResize = typeof ResizeObserver === 'function',
        layoutShift = typeof IntersectionObserver === 'function',
        animationFrame = false
      } = options;
      const referenceEl = unwrapElement(reference);
      const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? getOverflowAncestors(referenceEl) : []), ...getOverflowAncestors(floating)] : [];
      ancestors.forEach(ancestor => {
        ancestorScroll && ancestor.addEventListener('scroll', update, {
          passive: true
        });
        ancestorResize && ancestor.addEventListener('resize', update);
      });
      const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
      let reobserveFrame = -1;
      let resizeObserver = null;
      if (elementResize) {
        resizeObserver = new ResizeObserver(_ref => {
          let [firstEntry] = _ref;
          if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
            // Prevent update loops when using the `size` middleware.
            // https://github.com/floating-ui/floating-ui/issues/1740
            resizeObserver.unobserve(floating);
            cancelAnimationFrame(reobserveFrame);
            reobserveFrame = requestAnimationFrame(() => {
              var _resizeObserver;
              (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
            });
          }
          update();
        });
        if (referenceEl && !animationFrame) {
          resizeObserver.observe(referenceEl);
        }
        resizeObserver.observe(floating);
      }
      let frameId;
      let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
      if (animationFrame) {
        frameLoop();
      }
      function frameLoop() {
        const nextRefRect = getBoundingClientRect(reference);
        if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
          update();
        }
        prevRefRect = nextRefRect;
        frameId = requestAnimationFrame(frameLoop);
      }
      update();
      return () => {
        var _resizeObserver2;
        ancestors.forEach(ancestor => {
          ancestorScroll && ancestor.removeEventListener('scroll', update);
          ancestorResize && ancestor.removeEventListener('resize', update);
        });
        cleanupIo == null || cleanupIo();
        (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
        resizeObserver = null;
        if (animationFrame) {
          cancelAnimationFrame(frameId);
        }
      };
    }

    /**
     * Modifies the placement by translating the floating element along the
     * specified axes.
     * A number (shorthand for `mainAxis` or distance), or an axes configuration
     * object may be passed.
     * @see https://floating-ui.com/docs/offset
     */
    const offset = offset$1;

    /**
     * Optimizes the visibility of the floating element by shifting it in order to
     * keep it in view when it will overflow the clipping boundary.
     * @see https://floating-ui.com/docs/shift
     */
    const shift = shift$1;

    /**
     * Optimizes the visibility of the floating element by flipping the `placement`
     * in order to keep it in view when the preferred placement(s) will overflow the
     * clipping boundary. Alternative to `autoPlacement`.
     * @see https://floating-ui.com/docs/flip
     */
    const flip = flip$1;

    /**
     * Provides data to position an inner element of the floating element so that it
     * appears centered to the reference element.
     * @see https://floating-ui.com/docs/arrow
     */
    const arrow = arrow$1;

    /**
     * Computes the `x` and `y` coordinates that will place the floating element
     * next to a given reference element.
     */
    const computePosition = (reference, floating, options) => {
      // This caches the expensive `getClippingElementAncestors` function so that
      // multiple lifecycle resets re-use the same result. It only lives for a
      // single call. If other functions become expensive, we can add them as well.
      const cache = new Map();
      const mergedOptions = {
        platform,
        ...options
      };
      const platformWithCache = {
        ...mergedOptions.platform,
        _c: cache
      };
      return computePosition$1(reference, floating, {
        ...mergedOptions,
        platform: platformWithCache
      });
    };

    const getSize = (element) => {
        let size = undefined;
        if (element) {
            const width = element.offsetWidth;
            const height = element.offsetHeight;
            size = { width, height };
        }
        return size;
    };

    const OPPOSITE_SIDE = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right",
    };
    class Popper {
        constructor(dotNetPopperObject) {
            this.alignOffset = 0;
            this.align = "center";
            this.sideOffset = 0;
            this.side = "bottom";
            this.arrowPadding = 0;
            this.arrow = null;
            this.computePosition = () => {
                var _a, _b;
                const arrowSize = getSize(this.arrow);
                const arrowWidth = (_a = arrowSize === null || arrowSize === void 0 ? void 0 : arrowSize.width) !== null && _a !== void 0 ? _a : 0;
                const arrowHeight = (_b = arrowSize === null || arrowSize === void 0 ? void 0 : arrowSize.height) !== null && _b !== void 0 ? _b : 0;
                const desiredPlacement = (this.side +
                    (this.align !== "center" ? "-" + this.align : ""));
                computePosition(this.anchor, this.content, {
                    strategy: "fixed",
                    placement: desiredPlacement,
                    middleware: [
                        offset({
                            mainAxis: this.sideOffset + arrowHeight,
                            alignmentAxis: this.alignOffset,
                        }),
                        flip(),
                        shift({ padding: 5 }),
                        this.arrow &&
                            arrow({
                                element: this.arrow,
                                padding: this.arrowPadding,
                            }),
                        transformOrigin({ arrowWidth, arrowHeight }),
                    ],
                }).then(({ x, y, middlewareData, placement }) => {
                    Object.assign(this.content.style, {
                        transform: `translate(${x}px, ${y}px)`,
                    });
                    if (this.arrow == null || middlewareData.arrow == null) {
                        return;
                    }
                    const { x: arrowX, y: arrowY } = middlewareData.arrow;
                    const [side] = getSideAndAlignFromPlacement(placement);
                    const oppositeSide = OPPOSITE_SIDE[side];
                    Object.assign(this.arrow.style, {
                        left: arrowX != null ? `${arrowX}px` : "",
                        top: arrowY != null ? `${arrowY}px` : "",
                        bottom: "",
                        right: "",
                        [oppositeSide]: 0,
                        transform: {
                            top: "translateY(100%)",
                            right: "translateY(50%) rotate(90deg) translateX(-50%)",
                            bottom: `rotate(180deg)`,
                            left: "translateY(50%) rotate(-90deg) translateX(50%)",
                        }[side],
                        transformOrigin: {
                            top: "",
                            right: "0 0",
                            bottom: "center 0",
                            left: "100% 0",
                        }[side],
                    });
                });
            };
            this.update = ({ alignOffset, align, sideOffset, side, arrow, arrowPadding, anchor, }) => {
                this.alignOffset = alignOffset;
                this.align = align;
                this.sideOffset = sideOffset;
                this.side = side;
                this.anchor = anchor;
                this.arrow = arrow;
                this.arrowPadding = arrowPadding;
                this.computePosition();
            };
            this.content = dotNetPopperObject.content;
            this.anchor = dotNetPopperObject.anchor;
            this.update(dotNetPopperObject);
            this.cleanup = autoUpdate(this.anchor, this.content, this.computePosition);
        }
    }
    const transformOrigin = (options) => ({
        name: "transformOrigin",
        options,
        fn(data) {
            var _a, _b, _c, _d, _e;
            const { placement, rects, middlewareData } = data;
            const cannotCenterArrow = ((_a = middlewareData.arrow) === null || _a === void 0 ? void 0 : _a.centerOffset) !== 0;
            const isArrowHidden = cannotCenterArrow;
            const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
            const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
            const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
            const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign];
            const arrowXCenter = ((_c = (_b = middlewareData.arrow) === null || _b === void 0 ? void 0 : _b.x) !== null && _c !== void 0 ? _c : 0) + arrowWidth / 2;
            const arrowYCenter = ((_e = (_d = middlewareData.arrow) === null || _d === void 0 ? void 0 : _d.y) !== null && _e !== void 0 ? _e : 0) + arrowHeight / 2;
            let x = "";
            let y = "";
            if (placedSide === "bottom") {
                x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
                y = `${-arrowHeight}px`;
            }
            else if (placedSide === "top") {
                x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
                y = `${rects.floating.height + arrowHeight}px`;
            }
            else if (placedSide === "right") {
                x = `${-arrowHeight}px`;
                y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
            }
            else if (placedSide === "left") {
                x = `${rects.floating.width + arrowHeight}px`;
                y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
            }
            return { data: { x, y } };
        },
    });
    const getSideAndAlignFromPlacement = (placement) => {
        const [side, align = "center"] = placement.split("-");
        return [side, align];
    };

    var Orientation;
    (function (Orientation) {
        Orientation[Orientation["Horizontal"] = 0] = "Horizontal";
        Orientation[Orientation["Vertical"] = 1] = "Vertical";
    })(Orientation || (Orientation = {}));

    class RovingFocus {
        get tabbableElements() {
            return this.elements.filter((x) => isTabbable(x));
        }
        constructor(orientation) {
            this.selected = 0;
            this.elements = [];
            this.focusedElement = null;
            this.onKeyDown = (event) => {
                if (!this.tabbableElements.some((tabbableElement) => tabbableElement === event.target)) {
                    return;
                }
                const isVertical = this.orientation === Orientation.Vertical;
                const isPrevKey = event.key === "ArrowUp" || event.key === "ArrowLeft";
                const isNextKey = event.key === "ArrowDown" || event.key === "ArrowRight";
                const isValidKey = (isVertical &&
                    (event.key === "ArrowUp" || event.key === "ArrowDown")) ||
                    (!isVertical &&
                        (event.key === "ArrowLeft" || event.key === "ArrowRight"));
                if (isValidKey) {
                    event.preventDefault();
                    if (isPrevKey) {
                        this.selected =
                            this.selected === 0
                                ? this.tabbableElements.length - 1
                                : this.selected - 1;
                    }
                    else if (isNextKey) {
                        this.selected =
                            this.selected === this.tabbableElements.length - 1
                                ? 0
                                : this.selected + 1;
                    }
                    this.changeFocus(this.selected);
                }
            };
            this.update = (orientation) => {
                this.orientation = orientation;
            };
            this.onFocus = (event) => {
                this.selected = this.tabbableElements.findIndex((tabbableElement) => tabbableElement === event.target);
            };
            this.changeFocus = (index) => {
                this.focusedElement = this.tabbableElements[index];
                this.focusedElement.focus();
            };
            this.addItem = (element) => {
                if (element == null) {
                    return;
                }
                if (this.elements.includes(element)) {
                    return;
                }
                element.addEventListener("focus", this.onFocus);
                element.addEventListener("keydown", this.onKeyDown);
                this.elements.push(element);
            };
            this.removeItem = (element) => {
                if (element == null) {
                    return;
                }
                element.removeEventListener("keydown", this.onKeyDown);
                element.removeEventListener("focus", this.onFocus);
                const index = this.elements.indexOf(element);
                if (index > -1) {
                    this.elements.splice(index, 1);
                }
            };
            this.dispose = () => {
                this.elements.forEach((element) => {
                    element.removeEventListener("keydown", this.onKeyDown);
                    element.removeEventListener("focus", this.onFocus);
                });
            };
            this.orientation = orientation;
        }
    }

    window.avatar = avatar;
    window.rovingFocus = (orientation) => new RovingFocus(orientation);
    window.focusTrap = (dotNetFocusTrapObject) => new FocusTrap(dotNetFocusTrapObject);
    window.popper = (dotNetPopperObject) => new Popper(dotNetPopperObject);

})();
