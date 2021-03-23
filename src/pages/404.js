import React from 'react';
import Layout from '../components/layout';
import { Ghost } from 'react-kawaii';

const NotFoundPage = ({ data }) => {
  return (
    <Layout title="404 Not Found">
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist..</p>
      <Ghost size={240} mood="sad" color="#E0E4E8" />
    </Layout>
  );
};

export default NotFoundPage;
