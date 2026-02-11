import fs from 'fs/promises';
import path from 'path';
import ClientAgreementPage from './ClientAgreementPage';
import { createClient } from '@/lib/supabaseServer';
import { requireUser } from '@/lib/requestUser';

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

export const revalidate = 3600; // Revalidate every hour

async function getTemplates() {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'templates.json');
    const jsonData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(jsonData);
}

export default async function CreateAgreementPage(){
    // Templates don't change often, cache for longer
    const templates = await getTemplates();
    return <ClientAgreementPage templates={templates} />;
}