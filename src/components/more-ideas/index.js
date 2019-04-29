import React from 'react';

import Heading from 'Components/text/heading';
import Image from 'Components/images/image';
import Link from 'Components/link';
import categories from '../../curated/categories';
import styles from './more-ideas.styl';

const MoreIdeas = () => (
  <section className={styles.container}>
    <Heading tagName="h2">More Ideas</Heading>
    <ul className={styles.grid}>
      {categories.map((category) => (
        <li className={styles.gridItem} key={category.id}>
          <Link className={styles.link} to={category.url} style={{ backgroundColor: category.color }}>
            <Image className={styles.image} src={category.avatarUrl} alt="" />
            <div>{category.name}</div>
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default MoreIdeas;
