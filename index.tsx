import {CtaGroup} from 'components/content';
import {Heading, LinkItem, List, RichText, Text} from 'components/editable';
import {Button} from 'components/form';
import {Container} from 'components/layout';
import * as Utils from 'components/libs';
import * as Types from 'components/types';
import React, {memo, useEffect, useState} from 'react';
import {Placeholder} from 'components/libs';
import './AjaxLoader.scss';
import './BigLink.scss';
import './Fact.scss';
import './Facts.scss';
import './Footer.scss';
import './Header.scss';
import './InsetBlock.scss';
import './Logos.scss';
import './SplitPic.scss';
import './Ticker.scss';
import './Title.scss';
import './Test.scss';

import {Block, Box} from 'components/block';

import {Figure} from 'components/media';

export const Test = () => (
	<>
		<Block theme="primary" pad="lg">
			<div className="test-hover">
				<Figure
					image={{
						src:
							'https://images.unsplash.com/photo-1563210080-dfe35c83e2eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80',
					}}
					crop={'1:1'}
				/>
			</div>
		</Block>
	</>
);

type FactProps = {
	value: string | number;
	prefix?: Types.Text;
	suffix?: Types.Text;
	content: Types.RichText;
};

export const Fact = memo((props: FactProps) => {
	const base: string = 'fact';
	const {value, content, prefix, suffix} = props;

	return (
		<p className={base}>
			<b className={`${base}__stat`}>
				{prefix && <span className={`${base}__prefix`}>{prefix}</span>}
				<span className={`${base}__value`}>{value}</span>
				{suffix && <span className={`${base}__suffix`}>{suffix}</span>}
			</b>
			<span className={`${base}__content`} dangerouslySetInnerHTML={{__html: content}} />
		</p>
	);
});

type FactsProps = {
	items: Array<FactProps>;
};

export const Facts = memo((props: FactsProps) => {
	const base: string = 'facts';
	const {items} = props;

	return (
		<div className={base}>
			{items.map((item, index) => (
				<Fact key={`fact-${index}`} {...item} />
			))}
		</div>
	);
});

type BigLinkProps = {
	href?: Types.Url;
	title?: Types.Text;
	theme?: Types.Theme;
};

export const BigLink = memo((props: BigLinkProps) => {
	const base: string = 'biglink';

	const {href = '#', title = '[Big Link]', theme = 'default'} = props;

	const atts = {
		className: Utils.getModifiers(base, {}),

		href,
		'data-theme': theme,
	};

	const Component = href ? 'a' : 'div';

	return (
		<Component {...atts}>
			<div className={`${base}__body`}>
				<Heading className={`${base}__title`} title={title} />
				<Placeholder.P />
			</div>
		</Component>
	);
});

type InsetBlockProps = {
	children: Types.Children;
};

export const InsetBlock = memo((props: InsetBlockProps) => {
	const base: string = 'inset-block';
	const {children} = props;

	return (
		<div className={base}>
			<header className={`${base}__header`} data-theme="dark">
				<Container>
					<div className={`${base}__inner`}>
						<h2>[title]</h2>
					</div>
				</Container>
			</header>
			<div className={`${base}__main`}>
				<Container>
					<div className={`${base}__body`} data-theme="grey">
						{children}
					</div>
				</Container>
			</div>
		</div>
	);
});

type SplitPicProps = {};

export const SplitPic = memo((props: SplitPicProps) => {
	const base: string = 'split-pic';

	return (
		<div className={base}>
			<div className={`${base}__main`}>
				<div className={`${base}__media`}>
					<Figure style="boxed" image={{src: '//via.placeholder.com/1200x400'}} caption="[image caption]" />
				</div>
				<div className={`${base}__content`}>
					<div className={`${base}__foo`}>
						<Placeholder.P />
						<Placeholder.P />
					</div>
				</div>
			</div>
		</div>
	);
});

type TickerProps = {
	children: Types.Children;
	speed?: Types.Number;
};

export const Ticker = memo((props: TickerProps) => {
	const base: string = 'ticker';
	const {children, speed = 3000} = props;

	if (!children || React.Children.count(children) === 0) {
		return null;
	}

	const ref = React.createRef<HTMLDivElement>();

	const atts = {className: Utils.getModifiers(base, {}), ref};

	let active = 0;

	const [height, setHeight] = useState(20);

	let items = React.Children.map(children, (item: any, index: number) => {
		const className = index === active ? ' active' : '';

		return (
			<div key={index} className={`${base}__item${className}`}>
				<div>{item}</div>
			</div>
		);
	});

	items.push(
		<div key="last" className={`${base}__item`}>
			<div>{React.Children.toArray(children)[0]}</div>
		</div>
	);

	const update = () => {};

	useEffect(() => {
		let timeout: any = null;

		let interval = setInterval(() => {
			if (ref && ref.current) {
				const main = ref.current.querySelector(`.${base}__main`);
				const items = ref.current.querySelectorAll(`.${base}__item`);
				let maxHeight = 0;

				items.forEach(function(item) {
					item.classList.remove('active');

					maxHeight = Math.max(maxHeight, item.firstChild.clientHeight);
				});

				if (maxHeight !== height) {
					setHeight(maxHeight);
				}

				active++;

				if (active >= items.length) {
					active = 0;
				}

				items[active].classList.add('active');

				const offset = height * active;

				if (main) {
					main.style.transform = `translateY(-${offset}px)`;
				}

				if (active === items.length - 1) {
					setTimeout(() => {
						if (ref && ref.current) {
							ref.current.classList.add('reset');
						}

						active = 0;
						items[active].classList.add('active');
						const offset = height * active;

						if (main) {
							main.style.transform = `translateY(-${offset}px)`;
						}

						timeout = setTimeout(() => {
							if (ref && ref.current) {
								ref.current.classList.remove('reset');
							}
							timeout = null;
						}, 100);
					}, 400);
				}
			}
		}, speed);

		return () => {
			if (interval) {
				clearInterval(interval);
			}

			if (timeout) {
				clearTimeout(timeout);
			}
		};
	});

	return (
		<div {...atts}>
			<div className={`${base}__main`} style={{height}}>
				{items}
			</div>
		</div>
	);
});

type LinkGroup = LinkItem | Array<LinkItem>;

type FilterListProps = {};

export const FilterList = memo((props: FilterListProps) => {
	const base: string = 'filterlist';

	const atts = {
		className: Utils.getModifiers(base, {}),
	};

	const list: Array<any> = [
		'Australia',
		'Brunei',
		'Cambodia',
		'Canada',
		'Colombia',
		'Denmark',
		'Germany',
		'Greater China',
		'Hong Kong',
		'India',
		'Indonesia',
		'Ireland',
		'Italy ',
		'Japan',
		'Macau',
		'Malaysia',
		'Mauritius',
		'Netherlands',
		'New Zealand',
		'Philippines',
		'Poland',
		'Qatar',
		'Romania',
		'Russia',
		'Serbia',
		'Singapore',
		'South Africa',
		'South Korea',
		'Spain',
		'Taiwan',
		'Thailand',
		'Turkey',
		'United Arab Emirates',
		'United Kingdom',
		'United States',
		'Vietnam',
		'Zimbabwe',
	];

	const search: string = 'un';

	const regExGeneric = new RegExp('' + search, 'i');
	const regEx = new RegExp('^' + search, 'i');

	const filtered = list
		.filter(item => {
			return item.match(regExGeneric);
		})
		.sort(a => {
			return a.match(regEx) ? -1 : 1;
		})
		.map(item => {
			return item.replace(regExGeneric, (r: string) => {
				return `<b>${r}</b>`;
			});
		});

	return (
		<div {...atts}>
			<div className={`${base}__body`}>
				<List isUnstyled>{filtered}</List>
			</div>
		</div>
	);
});

type AjaxChildrenProps = {
	items: Array<any>;
};

export interface ChildFunction {
	(params: AjaxChildrenProps): JSX.Element | null;
}

type AjaxLoaderProps = {
	children: ChildFunction;
	items?: Array<any>;
	autoload?: Types.TrueFalse;
};

export const AjaxLoader = memo((props: AjaxLoaderProps) => {
	const base: string = 'ajax-loader';

	const {children, autoload = true} = props;

	const [items, setItems] = useState(props.items || []);
	const [isLoading, setLoading] = useState(false);

	const loadItems = () => {
		setLoading(true);

		Utils.sleep(500).then(() => {
			setLoading(false);
			setItems([...items, ...['item']]);
		});
	};

	const onClick = (ev: MouseEvent) => {
		ev.preventDefault();

		loadItems();
	};

	useEffect(() => {
		/*
		if(!items || autoload)
		{
		loadItems();}
		*/
	});

	return (
		<div className={Utils.getModifiers(base, {})}>
			<div className={`${base}__body`}>
				<div className={`${base}__main`}>
					{children({items})}
					<div className={`${base}__footer`}>
						<Button
							priority="primary"
							label={'[Load next 10 articles]'}
							onClick={onClick}
							isLoading={isLoading}
							type="button"
						/>
					</div>
				</div>
			</div>
		</div>
	);
});

type TitleProps = {
	title: Types.Text;
	overline?: Types.Text;
	intro?: Types.RichText;
	cta?: LinkGroup;
};

export const Title = memo((props: TitleProps) => {
	const base: string = 'title';

	const {title, overline, intro, cta} = props;

	return (
		<div className={Utils.getModifiers(base, {})}>
			<div className={`${base}__body`}>
				<div className={`${base}__main`}>
					<Text content={overline} />
					<Heading priority={2} title={title} />
					<RichText content={intro} />
					<CtaGroup items={cta} className={`${base}__links`} />
				</div>
			</div>
		</div>
	);
});

type HeaderProps = {};

export const Header = memo((props: HeaderProps) => {
	const base: string = 'block-header';

	return (
		<div className={Utils.getModifiers(base, {})}>
			<div className={`${base}__body`}>
				<div className={`${base}__main`}>[block header]</div>
			</div>
		</div>
	);
});

type FooterProps = {};

export const Footer = memo((props: FooterProps) => {
	const base: string = 'block-footer';

	return (
		<div className={Utils.getModifiers(base, {})}>
			<div className={`${base}__body`}>
				<div className={`${base}__main`}>[block footer]</div>
			</div>
		</div>
	);
});

type LogosProps = {
	id?: Types.ID;
	theme?: Types.Theme;
	children: Types.Children;
	layout?: 'carousel' | 'grid';
};

import {Carousel} from 'components/carousel';
import * as Layout from 'components/layout';

export const Logos = memo((props: LogosProps) => {
	const base: string = 'logos';

	const {theme = 'light', children, layout = 'carousel', id = 'logos'} = props;

	if (!children || React.Children.count(children) === 0) {
		return null;
	}

	const atts = {
		className: Utils.getModifiers(base, {layout}),
	};

	return (
		<div {...atts}>
			<Container>
				<div className={`${base}__body`} data-theme={layout === 'carousel' ? theme : undefined}>
					<div className={`${base}__main`}>
						{layout === 'carousel' ? (
							<Carousel
								id={`${id}-logos`}
								options={{
									draggable: false,
									pageDots: false,
									prevNextButtons: false,
									groupCells: false,
									cellAlign: 'center',
									autoPlay: 3000,
									pauseAutoPlayOnHover: false,
								}}
								hasCustomControls={false}
							>
								{React.Children.map(children, (item, index) => (
									<div key={`logo-${index}`} className={`${base}__item`}>
										{item}
									</div>
								))}
							</Carousel>
						) : (
							<Layout.Grid>
								{React.Children.map(children, (item, index) => (
									<div key={`logo-${index}`} className={`${base}__item`}>
										{item}
									</div>
								))}
							</Layout.Grid>
						)}
					</div>
				</div>
			</Container>
		</div>
	);
});
