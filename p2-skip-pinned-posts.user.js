// ==UserScript==
// @name         P2 Skip Pinned Posts
// @namespace    https://github.com/sunyatasattva
// @version      1.0.0
// @description  Skip all pinned posts in a P2 and read the latest one
// @author       sunyatasattva
// @match        https://*.wordpress.com/
// @icon64       https://s1.wp.com/i/p2-webclip.png
// @grant        none
// ==/UserScript==

( function () {
	'use strict';

	if ( ! document.body.classList.contains( 'a8c-p2' ) ) return;

	function stringToElement( html ) {
		const $template = document.createElement( 'template' );

		$template.innerHTML = html.trim();

		return $template.content.firstChild;
	}

	const $ = document.querySelector.bind( document );
	const $$ = document.querySelectorAll.bind( document );

	const isCompactView =
		Array.from( document.body.classList ).filter( ( className ) =>
			className.includes( 'compact-view' )
		).length > 0;
	const bookmarkHTML = `
    <li class="p2020-bookmarks__item p2020-bookmarks__skip-pinned">
      <a href="#" class="p2020-bookmarks__item-link">
        <span class="p2020-bookmarks__item-label">Skip Pinned Posts</span>
      </a>
    </li>
    `;
	const $newBookmark = stringToElement( bookmarkHTML );
	const $bookmarksItems = $( "#sidebar nav ul[class*='bookmarks__items']" );

	$newBookmark.addEventListener( 'click', ( e ) => {
		e.preventDefault();

		const $firstNonPinnedPost = isCompactView
			? Array.from( $$( "[data-tippy-content='Pinned post']" ) )
					.pop()
					.closest( 'article.post' ).nextElementSibling
			: $( 'article.post:not(.sticky)' );

		$firstNonPinnedPost.scrollIntoView( { behavior: 'smooth' } );
	} );

	if ( ! $bookmarksItems ) {
		console.warn( "P2 Skip Pinned Post doesn't support this P2 theme" );
		return;
	}

	$bookmarksItems.appendChild( $newBookmark );

	const $styles = `
    .p2020-bookmarks__item.p2020-bookmarks__skip-pinned a:before {
      content: "";
      display: block;
      -webkit-mask: url(/wp-content/themes/pub/p2020/img/icons/custom-chevron.svg) no-repeat;
      mask: url(/wp-content/themes/pub/p2020/img/icons/custom-chevron.svg) no-repeat;
      -webkit-mask-size: cover;
      mask-size: cover;
      width: 1.5rem;
      height: 1.5rem;
      background: var(--p2-color-link);
    }
    `;

	const $styleSheet = document.createElement( 'style' );
	$styleSheet.innerText = $styles;
	document.head.appendChild( $styleSheet );
} )();
