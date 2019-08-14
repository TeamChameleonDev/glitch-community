import React, { useMemo, useRef } from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames/bind';

import Link from 'Components/link';
import Image from 'Components/images/image';
import { CDN_URL } from 'Utils/constants';

import styles from './styles.styl';

const cx = classNames.bind(styles);

const allCategories = [
  {
    name: 'Games',
    color: '#fae3d1',
    path: 'games',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Ftetris.svg`,
  },
  {
    name: 'Bots',
    color: '#c7bff0',
    path: 'handy-bots',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fbot.svg`,
  },
  {
    name: 'Music',
    color: '#a9c4f7',
    path: 'music',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fmusic.svg`,
  },
  {
    name: 'Art',
    color: '#f2a7bb',
    path: 'art',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fart.svg`,
  },
  {
    name: 'Productivity',
    color: '#7aa4d3',
    path: 'tools-for-work',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fwork.svg`,
  },
  {
    name: 'Hardware',
    color: '#6cd8a9',
    path: 'hardware',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fhardware.svg`,
  },
  {
    name: 'Building Blocks',
    color: '#65cad2',
    path: 'building-blocks',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fbuilding-blocks.svg?v=1561575219123`,
  },
  {
    name: 'Learn to Code',
    color: '#f8d3c8',
    path: 'learn-to-code',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Flearn.svg?v=1561575404279`,
  },
];

function CategoriesGrid({ categories, alwaysWrap, className }) {
  const el = useRef(null);

  const categoriesToRender = useMemo(() => allCategories.filter((category) => categories === 'all' || categories.includes(category.path)), [
    categories,
  ]);

  const width = el.current ? el.current.offsetWidth : 0;
  const baseClassName = cx({
    categoriesGridItem: true,
    alwaysWrap,
    small: width <= 500,
    medium: width <= 800,
  });

  return (
    <ul ref={el} className={styles.categoriesGrid} >
      {el.current && el.current.width}
      {categoriesToRender.map((category) => (
        <li key={category.path} className={className} style={{ '--bg-color': category.color }}>
          <Link to={`/${category.path}`}>
            <Image src={category.icon} alt="" />
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

propTypes.defaultProps = {
  wrapWidth: 0,
};

export default CategoriesGrid;
