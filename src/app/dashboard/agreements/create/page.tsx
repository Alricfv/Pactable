import fs from 'fs/promises';
import path from 'path';
import ClientAgreementPage from './ClientAgreementPage';
import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';

export type TemplateSection = {
    id: string;
    title: string;
    terms: string[];
};

export type Template= {
    id: string;
    title: string;
    description: string;
    sections: TemplateSection[];
};

export default async function CreateAgreementPage(){
    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        redirect ('/signin');
    }
    const filePath = path.join(process.cwd(), 'src', 'lib', 'templates.json');
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const templates: Template[] = JSON.parse(jsonData);

    return <ClientAgreementPage templates={templates} />;
}