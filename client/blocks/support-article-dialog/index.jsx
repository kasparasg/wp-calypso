/** @format */
/**
 * External Dependencies
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { flow, get } from 'lodash';
import { localize } from 'i18n-calypso';
import Gridicon from 'gridicons';

/**
 * Internal Dependencies
 */
import Button from 'components/button';
import Dialog from 'components/dialog';
import SupportArticleHeader from 'blocks/support-article-dialog/header';
import Placeholders from 'blocks/support-article-dialog/placeholders';
import EmbedContainer from 'components/embed-container';
import Emojify from 'components/emojify';
import QueryPostLikes from 'components/data/query-post-likes';
import QueryReaderPost from 'components/data/query-reader-post';
import QueryReaderSite from 'components/data/query-reader-site';
import { getPostByKey } from 'state/reader/posts/selectors';
import { getSite } from 'state/reader/sites/selectors';
import { SUPPORT_BLOG_ID } from 'blocks/inline-help/constants';
import getInlineSupportArticlePostId from 'state/selectors/get-inline-support-article-post-id';
import getInlineSupportArticlePostUrl from 'state/selectors/get-inline-support-article-post-url';
import isInlineSupportArticleVisible from 'state/selectors/is-inline-support-article-visible';
import { closeSupportArticleDialog } from 'state/inline-support-article/actions';

export class SupportArticleDialog extends Component {
	static propTypes = {
		closeSupportArticleDialog: PropTypes.Func.isRequired,
		isVisible: PropTypes.Boolean,
		post: PropTypes.object,
		postId: PropTypes.Number.isRequired,
		postUrl: PropTypes.string,
		translate: PropTypes.Func.isRequired,
	};

	getDialogButtons() {
		const { postUrl, translate } = this.props;
		return [
			postUrl ? (
				<Button href={ postUrl } target="_blank" primary>
					{ translate( 'Visit Article' ) } <Gridicon icon="external" size={ 12 } />
				</Button>
			) : (
				<React.Fragment />
			),
			<Button onClick={ this.props.closeSupportArticleDialog }>
				{ translate( 'Close', { textOnly: true } ) }
			</Button>,
		];
	}

	render() {
		const { post, site, postId, isVisible } = this.props;
		const isLoading = ! post;
		const postKey = { blogId: SUPPORT_BLOG_ID, postId };

		/*eslint-disable react/no-danger */
		return (
			<Dialog
				additionalClassNames="support-article-dialog"
				isVisible={ isVisible }
				buttons={ this.getDialogButtons() }
				onCancel={ this.props.closeSupportArticleDialog }
				onClose={ this.props.closeSupportArticleDialog }
			>
				<Emojify>
					{ site && <QueryPostLikes siteId={ post.site_ID } postId={ postId } /> }
					{ post && post.site_ID && <QueryReaderSite siteId={ +post.site_ID } /> }
					{ isLoading && <QueryReaderPost postKey={ postKey } /> }
					<article className="support-article-dialog__story">
						<SupportArticleHeader post={ post } isLoading={ isLoading } />
						{ isLoading ? (
							<Placeholders />
						) : (
							<EmbedContainer>
								<div
									className="support-article-dialog__story-content"
									dangerouslySetInnerHTML={ { __html: post.content } }
								/>
							</EmbedContainer>
						) }
					</article>
				</Emojify>
			</Dialog>
		);
		/*eslint-enable react/no-danger */
	}
}

export default flow(
	connect(
		state => {
			const postId = getInlineSupportArticlePostId( state );
			const postUrl = getInlineSupportArticlePostUrl( state );
			const post = getPostByKey( state, { blogId: SUPPORT_BLOG_ID, postId } );
			const siteId = get( post, 'site_ID' );
			const site = siteId && getSite( state, siteId );

			return {
				isVisible: isInlineSupportArticleVisible( state ),
				post,
				site,
				postId,
				postUrl,
			};
		},
		{
			closeSupportArticleDialog,
		}
	),
	localize
)( SupportArticleDialog );
