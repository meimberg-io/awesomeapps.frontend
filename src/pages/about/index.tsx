import React from 'react';
import { GetServerSideProps } from 'next';
import { STRAPI_BASEURL } from '../_app';


const AboutPage: React.FC = () => {


    return (
        <div>
            <header className="pt-6 pb-4 sm:pb-6 bg-blue-50">
                <div className="mx-auto flex max-w-7xl flex-row items-stretch gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-blue-950">dd</h1>
                    </div>
                </div>
            </header>

            <main className="pt-6 pb-4 sm:pb-6 max-w-7xl gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 mx-auto">
             ccc
            </main>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const response = await fetch(`${STRAPI_BASEURL}/abouts`);
        const about = await response.json();
        return { props: { about: about[0] || null } };
    } catch (error) {
        console.error(error);
        return { props: { about: null } };
    }
};

export default AboutPage;
