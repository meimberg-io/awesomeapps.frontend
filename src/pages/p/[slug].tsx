import React from "react";
import Header from "../../components/Header";
import {GetServerSideProps} from "next";
import {fetchPage} from "../../api/services";
import {Page} from "../../types/page";
import DynamicZoneComponent from "../../components/strapicomponents/dynamiczone/DynamicZoneComponent";

interface PageProps {
    slug: string;
    page: Page | null;
}

const DetailPage: React.FC<PageProps> = ({ slug, page }) => {
    console.log("slug",slug);


    console.log("Page",page);
    if (!page) {
        return <p>Page nicht gefunden</p>; // Fehlerhandling für ungültige IDs
    }

    return (

        <div>
            <Header/>
            <main>

                <div className="relative isolate overflow-hidden pt-16">
                    <div className="shadow-lg">

                        <header className="pt-6 pb-4 sm:pb-6 bg-red-50 ">
                            <div className="mx-auto flex max-w-7xl flex-row items-stretch gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 justify-between">
                                <div className="a1">
                                    <h1 className="text-xl font-semibold text-blue-950">{page.title}</h1>
                                    <p className="mt-3">{page.subtitle}</p>
                                </div>

                            </div>
                        </header>
                        <div className="pt-6 pb-4 sm:pb-6 max-w-3xl gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8  mx-auto">
                            <DynamicZoneComponent blocks={page.content} />
                        </div>
                    </div>

                </div>
            </main>
        </div>


    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params as { slug: string };

    try {
        const page : Page = await fetchPage(slug);
        return { props: { slug, page } };
    } catch (error) {
        console.error(error);
        return { props: { slug,page: null } };
    }
};
export default DetailPage;
