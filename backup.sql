--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: artist_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artist_images (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "artistId" uuid NOT NULL,
    "cloudinaryId" character varying NOT NULL,
    url character varying NOT NULL,
    alt character varying,
    width integer,
    height integer,
    format character varying,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "orderIndex" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    "categoryId" uuid
);


ALTER TABLE public.artist_images OWNER TO postgres;

--
-- Name: artist_translations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artist_translations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "artistId" uuid NOT NULL,
    "languageId" uuid NOT NULL,
    name character varying NOT NULL,
    biography text,
    specialty character varying,
    "seoTitle" character varying,
    "seoDescription" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.artist_translations OWNER TO postgres;

--
-- Name: artists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artists (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    slug character varying NOT NULL,
    avatar character varying,
    "instagramUrl" character varying,
    "orderIndex" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    "userId" uuid
);


ALTER TABLE public.artists OWNER TO postgres;

--
-- Name: blog_post_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blog_post_categories (
    "blogPostsId" uuid NOT NULL,
    "categoriesId" uuid NOT NULL
);


ALTER TABLE public.blog_post_categories OWNER TO postgres;

--
-- Name: blog_post_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blog_post_tags (
    "blogPostsId" uuid NOT NULL,
    "tagsId" uuid NOT NULL
);


ALTER TABLE public.blog_post_tags OWNER TO postgres;

--
-- Name: blog_post_translations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blog_post_translations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "blogPostId" uuid NOT NULL,
    "languageId" uuid NOT NULL,
    title character varying NOT NULL,
    excerpt text,
    content text,
    "seoTitle" character varying,
    "seoDescription" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.blog_post_translations OWNER TO postgres;

--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blog_posts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    slug character varying NOT NULL,
    "featuredImage" character varying,
    status character varying DEFAULT 'draft'::character varying NOT NULL,
    "publishedAt" timestamp without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "authorId" uuid,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.blog_posts OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    slug character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: category_translations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category_translations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "categoryId" uuid NOT NULL,
    "languageId" uuid NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.category_translations OWNER TO postgres;

--
-- Name: languages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.languages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code character varying NOT NULL,
    name character varying NOT NULL,
    "nativeName" character varying NOT NULL,
    direction character varying DEFAULT 'ltr'::character varying NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.languages OWNER TO postgres;

--
-- Name: promotions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code character varying,
    message character varying NOT NULL,
    "backgroundColor" character varying DEFAULT '#000000'::character varying NOT NULL,
    "textColor" character varying DEFAULT '#FFFFFF'::character varying NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.promotions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: seo_page_translations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seo_page_translations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "seoPageId" uuid NOT NULL,
    "languageId" uuid NOT NULL,
    title character varying,
    description text,
    "ogTitle" character varying,
    "ogDescription" text,
    "ogImage" character varying,
    keywords character varying
);


ALTER TABLE public.seo_page_translations OWNER TO postgres;

--
-- Name: seo_pages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seo_pages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "pageKey" character varying NOT NULL,
    "canonicalUrl" character varying,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    "noIndex" boolean DEFAULT false NOT NULL,
    "noFollow" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.seo_pages OWNER TO postgres;

--
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.settings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    key character varying NOT NULL,
    value text NOT NULL,
    type character varying DEFAULT 'string'::character varying NOT NULL,
    "group" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.settings OWNER TO postgres;

--
-- Name: tag_translations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag_translations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "tagId" uuid NOT NULL,
    "languageId" uuid NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.tag_translations OWNER TO postgres;

--
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    slug character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    "passwordHash" character varying NOT NULL,
    name character varying NOT NULL,
    avatar character varying,
    "isActive" boolean DEFAULT true NOT NULL,
    "roleId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: artist_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.artist_images (id, "artistId", "cloudinaryId", url, alt, width, height, format, "isFeatured", "orderIndex", "createdAt", "updatedAt", "deletedAt", "categoryId") FROM stdin;
a05caae4-72d1-4ee1-8ef1-127b45100aa6	31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc	salon-tatto/artists/31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc/e5lhquqsdy1weoiauizd	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782087656/salon-tatto/artists/31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc/e5lhquqsdy1weoiauizd.jpg	\N	613	670	jpg	f	6	2026-06-22 00:20:56.684276	2026-06-26 06:24:03.850793	\N	\N
85309b4d-92ec-4042-8b27-549682d0ce4a	31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc	mock-2	https://images.unsplash.com/photo-1583226162295-d2d46e964b4c?q=80&w=600&auto=format&fit=crop	NYC Skyline minimalist tattoo	\N	\N	\N	f	1	2026-06-21 10:24:05.210471	2026-06-22 00:15:14.900649	2026-06-22 00:15:14.900649	\N
e19d00e6-89c2-47ec-bd43-d009218caa43	31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc	salon-tatto/artists/31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc/rcgw8a2excuwl8gioqgo	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782087660/salon-tatto/artists/31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc/rcgw8a2excuwl8gioqgo.jpg	\N	609	612	jpg	f	0	2026-06-22 00:21:00.299367	2026-06-22 00:21:18.954265	2026-06-22 00:21:18.954265	\N
64deafc7-aaff-464b-b53d-2d37a6e4bae4	56da0840-fd02-4ec8-adc1-98cde006024e	mock-3	https://images.unsplash.com/photo-1612459284970-e8f027596582?q=80&w=600&auto=format&fit=crop	Ornamental back tattoo	\N	\N	\N	t	0	2026-06-21 10:24:05.246084	2026-06-23 02:55:15.941573	2026-06-23 02:55:15.941573	\N
9b62a095-5c02-4baa-90f8-20f72071a434	56da0840-fd02-4ec8-adc1-98cde006024e	mock-4	https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=600&auto=format&fit=crop	Scorpion fine line tattoo	\N	\N	\N	f	1	2026-06-21 10:24:05.246084	2026-06-23 02:55:26.039499	2026-06-23 02:55:26.039499	\N
0c0199b8-e709-4dbf-87ab-e55fc8d89518	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/olyhqsjmjjd3whunc852	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183356/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/olyhqsjmjjd3whunc852.jpg	\N	900	1200	jpg	f	0	2026-06-23 02:55:57.685789	2026-06-23 02:55:57.685789	\N	\N
3910f5a5-c6f1-43a9-b7ca-efb24e1c868c	31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc	mock-1	https://images.unsplash.com/photo-1590246814883-58742dcb200d?q=80&w=600&auto=format&fit=crop	Fine line floral tattoo	\N	\N	\N	f	0	2026-06-21 10:24:05.210471	2026-06-26 00:26:48.388798	2026-06-22 00:15:10.51921	\N
497a6e2f-1178-4be3-af0b-7906d658f56c	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/nlgfmwuj2weofkv0htec	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183366/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/nlgfmwuj2weofkv0htec.jpg	\N	900	1200	jpg	f	0	2026-06-23 02:56:07.108318	2026-06-26 05:21:04.699047	\N	68bb6577-2a53-471c-bee2-464798e7b136
dbd4738f-103a-442d-b05a-a76784cdbd6b	31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc	salon-tatto/artists/31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc/alt6mclj9zhwstwdz6wf	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782087657/salon-tatto/artists/31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc/alt6mclj9zhwstwdz6wf.jpg	\N	704	1079	jpg	f	7	2026-06-22 00:20:57.686171	2026-06-26 06:24:03.850793	\N	\N
fc4654c5-16c7-46ba-88f7-fdee5f022ba8	31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc	salon-tatto/artists/31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc/ggiasfyejjjzrkco6cg1	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782087659/salon-tatto/artists/31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc/ggiasfyejjjzrkco6cg1.jpg	\N	726	1168	jpg	f	0	2026-06-22 00:20:59.491819	2026-06-26 06:24:21.34777	\N	db77a3c5-f42c-46d9-b60a-ac1dec5e6e63
a7bac023-e93e-4431-acea-3ba42a80f156	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/xw69etizhap5cgnvhryu	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183368/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/xw69etizhap5cgnvhryu.jpg	\N	900	1200	jpg	f	0	2026-06-23 02:56:08.85432	2026-06-26 05:21:06.405624	\N	68bb6577-2a53-471c-bee2-464798e7b136
ff3ccf1e-e5e2-487b-9c73-afdae321919e	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/udhuzxidxbdhao4uvbse	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183361/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/udhuzxidxbdhao4uvbse.jpg	\N	900	1200	jpg	f	0	2026-06-23 02:56:02.067387	2026-06-26 05:21:15.209295	\N	dc0f9dfd-85a1-4995-a9a5-2c71d0b8df74
1c6e2629-e413-49bf-9834-d115b6000fa4	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/livqrun2oehvlj66wpqb	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183351/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/livqrun2oehvlj66wpqb.jpg	\N	768	1024	jpg	f	0	2026-06-23 02:55:52.339485	2026-06-26 05:21:23.104198	\N	68bb6577-2a53-471c-bee2-464798e7b136
d1846d37-af96-44d7-9375-2b4a565d2cb0	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/mrwzztu9k9afb1nmmqyz	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183364/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/mrwzztu9k9afb1nmmqyz.jpg	\N	900	1200	jpg	f	0	2026-06-23 02:56:05.189572	2026-06-26 05:21:13.252657	\N	dc0f9dfd-85a1-4995-a9a5-2c71d0b8df74
744df568-0456-479c-8738-0bff16829ca1	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/rlogrid0oh23hrsxvdng	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183348/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/rlogrid0oh23hrsxvdng.jpg	\N	768	1024	jpg	f	0	2026-06-23 02:55:49.339699	2026-06-26 05:21:25.360966	\N	68bb6577-2a53-471c-bee2-464798e7b136
c7d76354-1d88-4606-818e-ccd2e66fc9aa	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/ivmzkgwy2xfqo9cxcvdj	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183353/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/ivmzkgwy2xfqo9cxcvdj.jpg	\N	768	1024	jpg	f	0	2026-06-23 02:55:53.992617	2026-06-26 05:21:29.411233	\N	68bb6577-2a53-471c-bee2-464798e7b136
bb972cf9-c277-47a7-838f-a200b2e45da2	31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc	salon-tatto/artists/31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc/tdu3uyvkojdwmnb8r86d	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782087658/salon-tatto/artists/31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc/tdu3uyvkojdwmnb8r86d.jpg	\N	709	1128	jpg	f	1	2026-06-22 00:20:58.606898	2026-06-26 06:23:49.940399	\N	\N
079bad88-0508-4cc7-87cf-ab8da286bdc8	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/b3fitgcrecgss0oj2u7s	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183373/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/b3fitgcrecgss0oj2u7s.jpg	\N	1024	1024	jpg	f	0	2026-06-23 02:56:14.040539	2026-06-23 02:56:14.040539	\N	\N
30d04203-97e1-45d7-b670-3218e0f140bd	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/l64agxlxcdl09bb3iybk	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183376/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/l64agxlxcdl09bb3iybk.jpg	\N	768	1024	jpg	f	0	2026-06-23 02:56:17.311145	2026-06-23 02:56:17.311145	\N	\N
fda9c0e1-9f11-4930-a13a-4f4168354121	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/scwoagq3vgy9dxuorz3j	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183377/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/scwoagq3vgy9dxuorz3j.jpg	\N	768	1024	jpg	f	0	2026-06-23 02:56:18.37824	2026-06-23 02:56:18.37824	\N	\N
16f378d8-5cf9-4f01-a7fa-0bd8eb412d67	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/a2ncrwtxzufvngfzrvmy	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183378/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/a2ncrwtxzufvngfzrvmy.jpg	\N	1024	768	jpg	f	0	2026-06-23 02:56:19.252328	2026-06-23 02:56:19.252328	\N	\N
db90e163-6876-4672-9760-24729d376e8a	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/qs9srwdlop1kmepcn3xr	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183379/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/qs9srwdlop1kmepcn3xr.jpg	\N	768	1024	jpg	f	0	2026-06-23 02:56:20.205298	2026-06-23 02:56:20.205298	\N	\N
fa515aec-a76f-43c8-8a7b-bcce38078aae	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/q7rykyjokc89vviufbo7	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183380/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/q7rykyjokc89vviufbo7.jpg	\N	768	1024	jpg	f	0	2026-06-23 02:56:21.163548	2026-06-23 02:56:21.163548	\N	\N
1ba3bcba-4eba-4bbd-b640-d42a6e23d4b3	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/wvfyvlmwqtps6c0vs9cr	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183381/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/wvfyvlmwqtps6c0vs9cr.jpg	\N	768	1024	jpg	f	0	2026-06-23 02:56:22.06308	2026-06-23 02:56:22.06308	\N	\N
7993d5e2-8b34-4f1b-982e-adb0e87d6e49	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/e40pdfcm879mlqxxdkqp	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183382/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/e40pdfcm879mlqxxdkqp.jpg	\N	768	1024	jpg	f	0	2026-06-23 02:56:23.249532	2026-06-23 02:56:23.249532	\N	\N
8b9d3e9b-7683-4cd6-8660-bf59ee7f2b64	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/wrd2uwybqxgtzqmlrwkp	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183383/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/wrd2uwybqxgtzqmlrwkp.jpg	\N	768	1024	jpg	f	0	2026-06-23 02:56:24.333929	2026-06-23 02:56:24.333929	\N	\N
8ec419f2-8efe-415d-9668-77b905653273	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/o15limjfoxeefirgmfcc	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183384/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/o15limjfoxeefirgmfcc.jpg	\N	768	1024	jpg	f	0	2026-06-23 02:56:25.273775	2026-06-23 02:56:25.273775	\N	\N
c659959e-f5be-465f-95a1-185194cc6a38	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/vig7ybjimz9osyblsngz	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183386/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/vig7ybjimz9osyblsngz.jpg	\N	974	1200	jpg	f	0	2026-06-23 02:56:27.119376	2026-06-23 02:56:27.119376	\N	\N
214c1f60-fb42-47bc-a404-f4f6108aedc6	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/rltyml5lr1wgmbghls5d	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183388/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/rltyml5lr1wgmbghls5d.jpg	\N	900	1200	jpg	f	0	2026-06-23 02:56:29.182962	2026-06-23 02:56:29.182962	\N	\N
31f848e8-30d9-4825-a636-6f2d44d79eba	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/lt8pc0iy3opl7l6y1x52	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183390/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/lt8pc0iy3opl7l6y1x52.jpg	\N	1005	1200	jpg	f	0	2026-06-23 02:56:31.534256	2026-06-23 02:56:31.534256	\N	\N
981a1e71-926f-4a92-90ac-6689cdd42e2a	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/nke3snxbubbvmxyymsuj	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183391/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/nke3snxbubbvmxyymsuj.jpg	\N	768	1024	jpg	f	0	2026-06-23 02:56:32.376495	2026-06-23 02:56:32.376495	\N	\N
97372b49-0d59-42d9-bc25-df56fef36dc7	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/hs6kne7gm8vvdl2fhtb1	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183392/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/hs6kne7gm8vvdl2fhtb1.jpg	\N	842	1024	jpg	f	0	2026-06-23 02:56:33.189013	2026-06-23 02:56:33.189013	\N	\N
86f458b5-f2de-4d2f-aa7f-19cfc7802e41	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/odorm0caajkmz77zvso5	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183393/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/odorm0caajkmz77zvso5.jpg	\N	768	1024	jpg	f	0	2026-06-23 02:56:34.171585	2026-06-23 02:56:34.171585	\N	\N
42f04b71-49b4-4467-ac06-dc7f8ba3b567	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/p5rtod3aeqlm7z6feozl	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183371/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/p5rtod3aeqlm7z6feozl.jpg	\N	1113	1200	jpg	f	0	2026-06-23 02:56:12.762896	2026-06-26 05:21:09.730764	\N	68bb6577-2a53-471c-bee2-464798e7b136
feb30a4d-e60f-4dde-9511-f8e88518d354	56da0840-fd02-4ec8-adc1-98cde006024e	salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/a1src6klekfqvxlrm8ip	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183375/salon-tatto/artists/56da0840-fd02-4ec8-adc1-98cde006024e/a1src6klekfqvxlrm8ip.jpg	\N	900	1200	jpg	f	0	2026-06-23 02:56:16.333091	2026-06-26 05:21:18.38527	\N	dc0f9dfd-85a1-4995-a9a5-2c71d0b8df74
75f48b97-abf0-4bca-a54c-3527143944c0	31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc	salon-tatto/artists/31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc/ly2tr4nrnjhgpdlli7j8	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782087322/salon-tatto/artists/31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc/ly2tr4nrnjhgpdlli7j8.jpg	\N	721	961	jpg	f	4	2026-06-22 00:15:22.63778	2026-06-26 06:24:01.048819	\N	\N
854443a8-065d-41d3-b994-30a942c910c1	31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc	salon-tatto/artists/31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc/kyidvpviwzrrxivx8mvn	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782087661/salon-tatto/artists/31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc/kyidvpviwzrrxivx8mvn.jpg	\N	609	612	jpg	f	2	2026-06-22 00:21:01.178518	2026-06-26 04:53:47.760565	\N	\N
4bbe9831-f0a8-4cec-8c77-0c0c347d4a84	31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc	salon-tatto/artists/31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc/tsv1ic6ari7u7rytzwud	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782087662/salon-tatto/artists/31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc/tsv1ic6ari7u7rytzwud.jpg	\N	593	576	jpg	t	3	2026-06-22 00:21:02.205641	2026-06-26 06:23:49.940399	\N	\N
b87c3de1-b312-41d8-81bf-62f473c722a2	31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc	salon-tatto/artists/31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc/o3clny3vocke8z3s9nwh	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782433550/salon-tatto/artists/31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc/o3clny3vocke8z3s9nwh.jpg	\N	576	1024	jpg	f	5	2026-06-26 00:25:50.308664	2026-06-26 06:24:03.850793	\N	\N
\.


--
-- Data for Name: artist_translations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.artist_translations (id, "artistId", "languageId", name, biography, specialty, "seoTitle", "seoDescription", "createdAt", "updatedAt") FROM stdin;
fcbb256a-746b-4184-a2a6-7d837db002aa	56da0840-fd02-4ec8-adc1-98cde006024e	fb8cd541-71f9-437c-abca-dd102baf8bf1	Ariel	Ariel creates stunning ornamental designs using solid blackwork techniques.	Ornamental & Blackwork			2026-06-23 02:55:25.757626	2026-06-23 02:55:25.757626
451ae8b7-8e53-472d-aafa-73cf458da5cb	56da0840-fd02-4ec8-adc1-98cde006024e	12b8734a-c471-4884-a0f7-3cf90c75cdb6	Ariel Chen	Ariel crea impresionantes diseños ornamentales utilizando técnicas de blackwork sólido.	Ornamental y Blackwork			2026-06-23 02:55:25.757626	2026-06-23 02:55:25.757626
a7cc5dbc-01ff-4523-a9b4-813a95400565	31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc	fb8cd541-71f9-437c-abca-dd102baf8bf1	Nathalia Cantillo	Nathalia is a specialist in fine line tattoos and micro realism.	Fine Line & Micro Realism			2026-06-26 05:12:29.89794	2026-06-26 05:12:29.89794
8b4a0d4f-86f5-46bb-a5f9-2180b56e9d55	31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc	12b8734a-c471-4884-a0f7-3cf90c75cdb6	Nathalia Cantillo	Nathalia Cantillo es especialista en tatuajes de línea fina y micro realismo.	Fine Line y Micro Realismo			2026-06-26 05:12:29.89794	2026-06-26 05:12:29.89794
\.


--
-- Data for Name: artists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.artists (id, slug, avatar, "instagramUrl", "orderIndex", "isActive", "createdAt", "updatedAt", "deletedAt", "userId") FROM stdin;
31da4dbd-bfdc-4859-bbbc-29f6c66e6bfc	nathalia-cantillo	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782088500/salon-tatto/uploads/idw8qosjdmo8ea3zapj7.jpg	https://instagram.com/elenasilva.tattoo	0	t	2026-06-21 10:24:05.143198	2026-06-22 00:35:12.76789	\N	\N
56da0840-fd02-4ec8-adc1-98cde006024e	ariel	https://res.cloudinary.com/dlimmlxeh/image/upload/v1782183288/salon-tatto/uploads/zrvphh1qs7qchakqkrfk.jpg	https://instagram.com/marcuschen.tattoo	1	t	2026-06-21 10:24:05.228815	2026-06-23 02:55:15.666156	\N	\N
\.


--
-- Data for Name: blog_post_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blog_post_categories ("blogPostsId", "categoriesId") FROM stdin;
\.


--
-- Data for Name: blog_post_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blog_post_tags ("blogPostsId", "tagsId") FROM stdin;
\.


--
-- Data for Name: blog_post_translations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blog_post_translations (id, "blogPostId", "languageId", title, excerpt, content, "seoTitle", "seoDescription", "createdAt", "updatedAt") FROM stdin;
7b31d57c-82b7-4640-aee3-9ddde722315a	df5a7c18-6e88-44b9-831e-fe6864832cc6	fb8cd541-71f9-437c-abca-dd102baf8bf1	The Ultimate Guide to Fine Line Tattoos	Everything you need to know before getting your first fine line tattoo.	<p>Fine line tattoos are created using single needles or small groupings to create delicate, detailed designs. Healing them properly is crucial.</p>	\N	\N	2026-06-21 10:24:05.361238	2026-06-21 10:24:05.361238
214b08d1-9c97-4f35-8bfe-9e5be30e9fb0	df5a7c18-6e88-44b9-831e-fe6864832cc6	12b8734a-c471-4884-a0f7-3cf90c75cdb6	La Guía Definitiva de Tatuajes Fine Line	Todo lo que necesitas saber antes de hacerte tu primer tatuaje fine line.	<p>Los tatuajes de línea fina se crean usando agujas únicas para diseños delicados. Su correcta curación es vital.</p>	\N	\N	2026-06-21 10:24:05.361238	2026-06-21 10:24:05.361238
51689cc3-5c00-4498-92c0-86df0e313f50	05b74344-f0ac-4411-b57f-9afbff3a3f79	fb8cd541-71f9-437c-abca-dd102baf8bf1	Tattoo Aftercare 101	How to take care of your fresh ink to ensure it heals perfectly.	<p>Keep it clean, keep it moisturized, and keep it out of the sun.</p>	\N	\N	2026-06-21 10:24:05.455155	2026-06-21 10:24:05.455155
f2444aa8-0f22-487a-89b1-6a8e413b95b1	05b74344-f0ac-4411-b57f-9afbff3a3f79	12b8734a-c471-4884-a0f7-3cf90c75cdb6	Cuidado de Tatuajes 101	Cómo cuidar tu nueva tinta para asegurar que sane perfectamente.	<p>Mantenlo limpio, hidratado y fuera del alcance del sol directo.</p>	\N	\N	2026-06-21 10:24:05.455155	2026-06-21 10:24:05.455155
645dd87f-5537-4c51-a87b-7e1a8f4126ca	e8a5de0c-4884-4f36-ad10-1de1c5f4c38e	fb8cd541-71f9-437c-abca-dd102baf8bf1	Choosing the Right Placement	Pain charts, aging, and visibility: what to consider when deciding where to get tattooed.	<p>The placement of a tattoo can drastically affect both the pain level and how the tattoo ages over time. Areas with high friction tend to fade faster.</p>	\N	\N	2026-06-22 03:40:32.283682	2026-06-22 03:40:32.283682
0edfc4ad-a457-47f7-8495-f9703f831343	e8a5de0c-4884-4f36-ad10-1de1c5f4c38e	12b8734a-c471-4884-a0f7-3cf90c75cdb6	Eligiendo el Lugar Correcto	Mapas de dolor, envejecimiento y visibilidad: qué considerar al decidir dónde tatuarse.	<p>La ubicación de un tatuaje puede afectar drásticamente tanto el nivel de dolor como la forma en que el tatuaje envejece con el tiempo.</p>	\N	\N	2026-06-22 03:40:32.283682	2026-06-22 03:40:32.283682
5ce0bbb0-6930-4fba-a18e-0d4693ff0038	02b2b858-2a13-4edb-b93d-7624373aad3e	fb8cd541-71f9-437c-abca-dd102baf8bf1	The History of Traditional Tattoos	A deep dive into American Traditional tattoos and their timeless aesthetic.	<p>Characterized by bold black outlines and a limited color palette, traditional tattoos have stood the test of time.</p>	\N	\N	2026-06-22 03:40:32.307112	2026-06-22 03:40:32.307112
96e2589b-a7d9-4fda-a65d-a70035833abb	02b2b858-2a13-4edb-b93d-7624373aad3e	12b8734a-c471-4884-a0f7-3cf90c75cdb6	La Historia de los Tatuajes Tradicionales	Una inmersión profunda en los tatuajes tradicionales americanos y su estética atemporal.	<p>Caracterizados por líneas negras gruesas y una paleta de colores limitada, los tatuajes tradicionales han resistido la prueba del tiempo.</p>	\N	\N	2026-06-22 03:40:32.307112	2026-06-22 03:40:32.307112
5d2cd92a-42f0-4ef6-93a1-cfd5f808104f	eea534c9-d349-4ac3-9e02-0e931b8c6e35	fb8cd541-71f9-437c-abca-dd102baf8bf1	Minimalist Tattoos: Less is More	Why small, elegant, and subtle tattoos are dominating the industry right now.	<p>Minimalism isn’t just a lifestyle; it has become one of the most requested tattoo styles globally. It requires incredible precision.</p>	\N	\N	2026-06-22 03:40:32.324491	2026-06-22 03:40:32.324491
1f6e32b9-5fc2-494d-813d-af011c9d134b	eea534c9-d349-4ac3-9e02-0e931b8c6e35	12b8734a-c471-4884-a0f7-3cf90c75cdb6	Tatuajes Minimalistas: Menos es Más	Por qué los tatuajes pequeños, elegantes y sutiles están dominando la industria ahora mismo.	<p>El minimalismo no es solo un estilo de vida; se ha convertido en uno de los estilos de tatuaje más solicitados a nivel mundial.</p>	\N	\N	2026-06-22 03:40:32.324491	2026-06-22 03:40:32.324491
1bc5cffc-17eb-447c-9407-2135e8796072	bc934767-a6af-426a-bc9b-6f2ffbe9a0fb	fb8cd541-71f9-437c-abca-dd102baf8bf1	Watercolor Tattoos Explained	The technique behind vibrant, brush-stroke tattoos and how they heal.	<p>Watercolor tattoos simulate the effect of a watercolor painting on the skin. They require a very specific approach to ensure longevity.</p>	\N	\N	2026-06-22 03:40:32.341036	2026-06-22 03:40:32.341036
7d342744-57d8-4888-85c7-1ca845558e45	bc934767-a6af-426a-bc9b-6f2ffbe9a0fb	12b8734a-c471-4884-a0f7-3cf90c75cdb6	Explicación de los Tatuajes Acuarela	La técnica detrás de los tatuajes vibrantes con efecto de pinceladas y cómo curan.	<p>Los tatuajes de acuarela simulan el efecto de una pintura sobre la piel. Requieren un enfoque muy específico para garantizar su longevidad.</p>	\N	\N	2026-06-22 03:40:32.341036	2026-06-22 03:40:32.341036
0713c573-2bb0-403e-a35b-3537c3a4b78b	943d1f4c-70a3-4f1d-93b0-1f23b2366775	fb8cd541-71f9-437c-abca-dd102baf8bf1	How to Prepare for Your First Custom Tattoo	Tips and tricks to ensure your custom design session goes smoothly.	<p>A custom tattoo requires clear communication with your artist. Bring references, stay hydrated, and trust the professional process.</p>	\N	\N	2026-06-22 03:40:32.383597	2026-06-22 03:40:32.383597
ba574891-d9c5-4c9c-8327-022a541121be	943d1f4c-70a3-4f1d-93b0-1f23b2366775	12b8734a-c471-4884-a0f7-3cf90c75cdb6	Cómo prepararte para tu primer tatuaje personalizado	Consejos y trucos para asegurar que tu sesión de diseño a medida sea un éxito.	<p>Un tatuaje personalizado requiere comunicación clara con tu artista. Trae referencias, mantente hidratado y confía en el proceso profesional.</p>	\N	\N	2026-06-22 03:40:32.383597	2026-06-22 03:40:32.383597
7763c5db-2e63-46f6-a90a-0b7887c5c8ef	1eb739a3-e78a-46ec-bc14-f772d2681b9a	fb8cd541-71f9-437c-abca-dd102baf8bf1	The Rise of UV Tattoos: What You Need to Know	Everything about blacklight tattoos, from safety to aftercare.	<p>UV tattoos use reactive ink that glows under blacklight but remains practically invisible under normal light. They are a unique way to hide or highlight your ink.</p>	\N	\N	2026-06-22 03:40:32.403283	2026-06-22 03:40:32.403283
f72493c9-e99a-460e-99ad-85eaed3b2395	1eb739a3-e78a-46ec-bc14-f772d2681b9a	12b8734a-c471-4884-a0f7-3cf90c75cdb6	El auge de los tatuajes UV: Lo que necesitas saber	Todo sobre los tatuajes de luz negra, desde la seguridad hasta los cuidados.	<p>Los tatuajes UV usan tinta reactiva que brilla bajo luz negra pero permanece casi invisible bajo luz normal. Son una forma única de ocultar o resaltar tu tinta.</p>	\N	\N	2026-06-22 03:40:32.403283	2026-06-22 03:40:32.403283
8e7013f5-8653-4a68-8a50-86bc45073ee9	29d44d8d-0acb-4857-a02b-60379ec22168	fb8cd541-71f9-437c-abca-dd102baf8bf1	Tattoo Etiquette for Tourists in NYC	Getting inked in New York? Here are the unspoken rules you should know.	<p>Getting a souvenir tattoo in NYC is a rite of passage. Be sure to book in advance, respect shop minimums, and always tip your artist!</p>	\N	\N	2026-06-22 03:40:32.429207	2026-06-22 03:40:32.429207
fa54a10f-3b79-4d6a-9a68-99e9131ca024	29d44d8d-0acb-4857-a02b-60379ec22168	12b8734a-c471-4884-a0f7-3cf90c75cdb6	Etiqueta de tatuajes para turistas en NYC	¿Te vas a tatuar en Nueva York? Aquí tienes las reglas no escritas que debes conocer.	<p>Hacerse un tatuaje de recuerdo en NYC es un rito de paso. Asegúrate de reservar con tiempo, respetar los mínimos del estudio y ¡siempre dar propina a tu artista!</p>	\N	\N	2026-06-22 03:40:32.429207	2026-06-22 03:40:32.429207
2962ad60-05a0-4488-98f0-c81b5cd128cf	c5a75006-0149-49bc-a7e1-77d85d959e88	fb8cd541-71f9-437c-abca-dd102baf8bf1	Why Ornamental Tattoos Are Timeless	Exploring the beauty of decorative body art that flows with your anatomy.	<p>Ornamental tattoos mimic the look of jewelry, lace, or mandalas. Their elegance comes from how perfectly they conform to the natural curves of the body.</p>	\N	\N	2026-06-22 03:40:32.445238	2026-06-22 03:40:32.445238
1ff12a35-a0d8-4a25-903a-52ddf97a32cd	c5a75006-0149-49bc-a7e1-77d85d959e88	12b8734a-c471-4884-a0f7-3cf90c75cdb6	Por qué los tatuajes ornamentales son atemporales	Explorando la belleza del arte corporal decorativo que fluye con tu anatomía.	<p>Los tatuajes ornamentales imitan el aspecto de las joyas, encajes o mandalas. Su elegancia proviene de lo perfectamente que se adaptan a las curvas del cuerpo.</p>	\N	\N	2026-06-22 03:40:32.445238	2026-06-22 03:40:32.445238
\.


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blog_posts (id, slug, "featuredImage", status, "publishedAt", "isActive", "authorId", "createdAt", "updatedAt", "deletedAt") FROM stdin;
df5a7c18-6e88-44b9-831e-fe6864832cc6	guide-to-fine-line-tattoos	https://images.unsplash.com/photo-1598371839696-5e5bb00b059b?q=80&w=800&auto=format&fit=crop	published	2026-06-21 05:24:05.288	t	ed285a16-c4ef-4da3-9be6-4a3d5b3494e9	2026-06-21 10:24:05.290482	2026-06-21 10:24:05.290482	\N
05b74344-f0ac-4411-b57f-9afbff3a3f79	tattoo-aftercare	https://images.unsplash.com/photo-1611501271465-9eb84ff6a24d?q=80&w=800&auto=format&fit=crop	published	2026-06-21 05:24:05.442	t	ed285a16-c4ef-4da3-9be6-4a3d5b3494e9	2026-06-21 10:24:05.444429	2026-06-21 10:24:05.444429	\N
e8a5de0c-4884-4f36-ad10-1de1c5f4c38e	choosing-tattoo-placement	https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=800&auto=format&fit=crop	published	2026-06-21 22:40:32.253	t	ed285a16-c4ef-4da3-9be6-4a3d5b3494e9	2026-06-22 03:40:32.255613	2026-06-22 03:40:32.255613	\N
02b2b858-2a13-4edb-b93d-7624373aad3e	history-traditional-tattoos	https://images.unsplash.com/photo-1590246814883-57832eed39bc?q=80&w=800&auto=format&fit=crop	published	2026-06-21 22:40:32.295	t	ed285a16-c4ef-4da3-9be6-4a3d5b3494e9	2026-06-22 03:40:32.296968	2026-06-22 03:40:32.296968	\N
eea534c9-d349-4ac3-9e02-0e931b8c6e35	minimalist-tattoos-trend	https://images.unsplash.com/photo-1542382025-a1c2cb0dd3db?q=80&w=800&auto=format&fit=crop	published	2026-06-21 22:40:32.317	t	ed285a16-c4ef-4da3-9be6-4a3d5b3494e9	2026-06-22 03:40:32.318465	2026-06-22 03:40:32.318465	\N
bc934767-a6af-426a-bc9b-6f2ffbe9a0fb	watercolor-tattoos	https://images.unsplash.com/photo-1550537687-c91072c4792d?q=80&w=800&auto=format&fit=crop	published	2026-06-21 22:40:32.333	t	ed285a16-c4ef-4da3-9be6-4a3d5b3494e9	2026-06-22 03:40:32.33508	2026-06-22 03:40:32.33508	\N
943d1f4c-70a3-4f1d-93b0-1f23b2366775	prepare-custom-tattoo	https://images.unsplash.com/photo-1598371839696-5e5bb00b059b?q=80&w=800&auto=format&fit=crop	published	2026-06-21 22:40:32.376	t	ed285a16-c4ef-4da3-9be6-4a3d5b3494e9	2026-06-22 03:40:32.377536	2026-06-22 03:40:32.377536	\N
1eb739a3-e78a-46ec-bc14-f772d2681b9a	rise-uv-tattoos	https://images.unsplash.com/photo-1611501271465-9eb84ff6a24d?q=80&w=800&auto=format&fit=crop	published	2026-06-21 22:40:32.392	t	ed285a16-c4ef-4da3-9be6-4a3d5b3494e9	2026-06-22 03:40:32.394262	2026-06-22 03:40:32.394262	\N
29d44d8d-0acb-4857-a02b-60379ec22168	tattoo-etiquette-tourists-nyc	https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=800&auto=format&fit=crop	published	2026-06-21 22:40:32.418	t	ed285a16-c4ef-4da3-9be6-4a3d5b3494e9	2026-06-22 03:40:32.419878	2026-06-22 03:40:32.419878	\N
c5a75006-0149-49bc-a7e1-77d85d959e88	ornamental-tattoos-timeless	https://images.unsplash.com/photo-1590246814883-57832eed39bc?q=80&w=800&auto=format&fit=crop	published	2026-06-21 22:40:32.437	t	ed285a16-c4ef-4da3-9be6-4a3d5b3494e9	2026-06-22 03:40:32.439089	2026-06-22 03:40:32.439089	\N
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, slug, "createdAt", "updatedAt", "deletedAt") FROM stdin;
2fa29335-10b6-4d16-bcd8-b3643ddbd3eb	ornamental	2026-06-22 03:27:41.962757	2026-06-22 03:27:41.962757	\N
b5be7bc1-448c-462b-a01d-a0bf56d0ddcb	custom	2026-06-22 03:27:42.60224	2026-06-22 03:27:42.60224	\N
16b9b667-c5c6-4653-8223-6ab50ef51ccb	uv	2026-06-22 03:27:42.626932	2026-06-22 03:27:42.626932	\N
db77a3c5-f42c-46d9-b60a-ac1dec5e6e63	fine-line	2026-06-22 03:27:42.648918	2026-06-22 03:27:42.648918	\N
dc0f9dfd-85a1-4995-a9a5-2c71d0b8df74	tourist	2026-06-22 03:27:42.669781	2026-06-22 03:27:42.669781	\N
68bb6577-2a53-471c-bee2-464798e7b136	color	2026-06-26 00:21:38.308672	2026-06-26 00:21:38.308672	\N
\.


--
-- Data for Name: category_translations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category_translations (id, "categoryId", "languageId", name) FROM stdin;
76601d5f-ef55-4f3f-b7dd-e3f442bb35c9	2fa29335-10b6-4d16-bcd8-b3643ddbd3eb	fb8cd541-71f9-437c-abca-dd102baf8bf1	Ornamental Tattoos
77ca7155-2513-4aa4-9378-9d7b2ef81440	2fa29335-10b6-4d16-bcd8-b3643ddbd3eb	12b8734a-c471-4884-a0f7-3cf90c75cdb6	Tatuajes Ornamentales
52998385-f349-480e-a310-374b12de1c4a	b5be7bc1-448c-462b-a01d-a0bf56d0ddcb	fb8cd541-71f9-437c-abca-dd102baf8bf1	Custom & One-of-a-kind
2cc25d55-8549-40e6-9b8a-32b34725a87f	b5be7bc1-448c-462b-a01d-a0bf56d0ddcb	12b8734a-c471-4884-a0f7-3cf90c75cdb6	Personalizados
fd882d01-994e-4e28-bac1-63136a01998d	16b9b667-c5c6-4653-8223-6ab50ef51ccb	fb8cd541-71f9-437c-abca-dd102baf8bf1	UV Tattoos
2fcc81fd-5e65-43dd-8fbf-991bdbfad92a	16b9b667-c5c6-4653-8223-6ab50ef51ccb	12b8734a-c471-4884-a0f7-3cf90c75cdb6	Tatuajes UV
a3511f72-c046-4601-996b-6cb1e5c0f887	db77a3c5-f42c-46d9-b60a-ac1dec5e6e63	fb8cd541-71f9-437c-abca-dd102baf8bf1	Fine Line Tattoos
e145d24f-c231-4f83-a83f-a56734f28b19	db77a3c5-f42c-46d9-b60a-ac1dec5e6e63	12b8734a-c471-4884-a0f7-3cf90c75cdb6	Línea Fina
ae6e7be1-aa6a-4945-bb93-98919ab10f28	dc0f9dfd-85a1-4995-a9a5-2c71d0b8df74	fb8cd541-71f9-437c-abca-dd102baf8bf1	Tourist Tattoos
1caa309a-9611-4ee3-9a26-16e8fed9568e	dc0f9dfd-85a1-4995-a9a5-2c71d0b8df74	12b8734a-c471-4884-a0f7-3cf90c75cdb6	Para Turistas
5d85a986-32a6-4d9f-a764-352254955440	68bb6577-2a53-471c-bee2-464798e7b136	fb8cd541-71f9-437c-abca-dd102baf8bf1	Color
d7916478-41c1-4e74-a345-dd872e112aee	68bb6577-2a53-471c-bee2-464798e7b136	12b8734a-c471-4884-a0f7-3cf90c75cdb6	Color
\.


--
-- Data for Name: languages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.languages (id, code, name, "nativeName", direction, "isActive", "createdAt", "updatedAt", "deletedAt") FROM stdin;
fb8cd541-71f9-437c-abca-dd102baf8bf1	en	English	English	ltr	t	2026-06-21 10:24:03.520702	2026-06-21 10:24:03.520702	\N
12b8734a-c471-4884-a0f7-3cf90c75cdb6	es	Spanish	Español	ltr	t	2026-06-21 10:24:03.520702	2026-06-21 10:24:03.520702	\N
\.


--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotions (id, code, message, "backgroundColor", "textColor", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, "createdAt", "updatedAt", "deletedAt") FROM stdin;
fcecfc97-889a-42c4-8fb4-f1d581b231a5	admin	Full system access	2026-06-21 10:24:03.437943	2026-06-21 10:24:03.437943	\N
6d08175b-cd78-4ebf-8441-4a59d896d5b3	editor	Content management access	2026-06-21 10:24:03.437943	2026-06-21 10:24:03.437943	\N
\.


--
-- Data for Name: seo_page_translations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.seo_page_translations (id, "seoPageId", "languageId", title, description, "ogTitle", "ogDescription", "ogImage", keywords) FROM stdin;
65b76c53-ad58-4704-8c47-fd2fe59c0f95	4319f5bb-c187-4136-8199-6e38fb0a82a9	fb8cd541-71f9-437c-abca-dd102baf8bf1	La Rola Tattoo NYC - Home	Welcome to La Rola Tattoo NYC - professional tattoo studio	La Rola Tattoo NYC - Home	Welcome to La Rola Tattoo NYC - professional tattoo studio		tattoo, studio, la rola tattoo
6f89cf37-72c7-4a0b-8d12-e0d0031ad96e	4319f5bb-c187-4136-8199-6e38fb0a82a9	12b8734a-c471-4884-a0f7-3cf90c75cdb6	La Rola Tattoo NYC - Inicio	Bienvenido a La Rola Tattoo NYC - estudio profesional de tatuajes	La Rola Tattoo NYC - home	Bienvenido a La Rola Tattoo NYC - estudio profesional de tatuajes		tatuaje, estudio, la rola tattoo
eb35678a-5ccb-4004-907e-ced74e0a29e8	8ad00e9d-f827-4947-a8a6-aa9301c73697	fb8cd541-71f9-437c-abca-dd102baf8bf1	La Rola Tattoo NYC - Studio	Welcome to La Rola Tattoo NYC - professional tattoo studio	La Rola Tattoo NYC - Studio	Welcome to La Rola Tattoo NYC - professional tattoo studio		tattoo, studio, la rola tattoo
38002ad7-0a0c-409a-91a2-e490794cf10e	8ad00e9d-f827-4947-a8a6-aa9301c73697	12b8734a-c471-4884-a0f7-3cf90c75cdb6	La Rola Tattoo NYC - Estudio	Bienvenido a La Rola Tattoo NYC - estudio profesional de tatuajes	La Rola Tattoo NYC - studio	Bienvenido a La Rola Tattoo NYC - estudio profesional de tatuajes		tatuaje, estudio, la rola tattoo
bd8250cf-feec-401f-91f4-b99f84403a47	f69884ad-a9c3-4dcb-9891-599a1dcc38fb	fb8cd541-71f9-437c-abca-dd102baf8bf1	La Rola Tattoo NYC - Artists	Welcome to La Rola Tattoo NYC - professional tattoo studio	La Rola Tattoo NYC - Artists	Welcome to La Rola Tattoo NYC - professional tattoo studio		tattoo, studio, la rola tattoo
4dad68a3-9bf1-4ed1-aa22-6277444f5657	f69884ad-a9c3-4dcb-9891-599a1dcc38fb	12b8734a-c471-4884-a0f7-3cf90c75cdb6	La Rola Tattoo NYC - Artistas	Bienvenido a La Rola Tattoo NYC - estudio profesional de tatuajes	La Rola Tattoo NYC - artists	Bienvenido a La Rola Tattoo NYC - estudio profesional de tatuajes		tatuaje, estudio, la rola tattoo
8a5ca7ed-406a-4e05-a108-2e8a4a5d2c9b	d64c47b6-7091-4aa0-8a2d-dd28821b0255	fb8cd541-71f9-437c-abca-dd102baf8bf1	La Rola Tattoo NYC - Gallery	Welcome to La Rola Tattoo NYC - professional tattoo studio	La Rola Tattoo NYC - Gallery	Welcome to La Rola Tattoo NYC - professional tattoo studio		tattoo, studio, la rola tattoo
38690fe3-b58b-4564-89ac-fd0443fca29c	d64c47b6-7091-4aa0-8a2d-dd28821b0255	12b8734a-c471-4884-a0f7-3cf90c75cdb6	La Rola Tattoo NYC - Galería	Bienvenido a La Rola Tattoo NYC - estudio profesional de tatuajes	La Rola Tattoo NYC - gallery	Bienvenido a La Rola Tattoo NYC - estudio profesional de tatuajes		tatuaje, estudio, la rola tattoo
889f253f-25ef-4f2b-a524-6765415f26aa	17b0edae-b37b-4393-a70d-0584457f89ee	fb8cd541-71f9-437c-abca-dd102baf8bf1	La Rola Tattoo NYC - Blog	Welcome to La Rola Tattoo NYC - professional tattoo studio	La Rola Tattoo NYC - Blog	Welcome to La Rola Tattoo NYC - professional tattoo studio		tattoo, studio, la rola tattoo
ae76369d-71b4-48d0-9d27-95be59c8b247	17b0edae-b37b-4393-a70d-0584457f89ee	12b8734a-c471-4884-a0f7-3cf90c75cdb6	La Rola Tattoo NYC - Blog	Bienvenido a La Rola Tattoo NYC - estudio profesional de tatuajes	La Rola Tattoo NYC - blog	Bienvenido a La Rola Tattoo NYC - estudio profesional de tatuajes		tatuaje, estudio, la rola tattoo
8188b46f-ef01-4bd7-9990-5035185abaff	da3890cc-c6fb-4317-8345-1408eae0985a	fb8cd541-71f9-437c-abca-dd102baf8bf1	La Rola Tattoo NYC - Contact	Welcome to La Rola Tattoo NYC - professional tattoo studio	La Rola Tattoo NYC - Contact	Welcome to La Rola Tattoo NYC - professional tattoo studio		tattoo, studio, la rola tattoo
018ae41f-2a05-4293-8e75-f5849a57c0b1	da3890cc-c6fb-4317-8345-1408eae0985a	12b8734a-c471-4884-a0f7-3cf90c75cdb6	La Rola Tattoo NYC - Contacto	Bienvenido a La Rola Tattoo NYC - estudio profesional de tatuajes	La Rola Tattoo NYC - contact	Bienvenido a La Rola Tattoo NYC - estudio profesional de tatuajes		tatuaje, estudio, la rola tattoo
\.


--
-- Data for Name: seo_pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.seo_pages (id, "pageKey", "canonicalUrl", "isActive", "createdAt", "updatedAt", "deletedAt", "noIndex", "noFollow") FROM stdin;
4319f5bb-c187-4136-8199-6e38fb0a82a9	home		t	2026-06-21 10:24:04.772056	2026-06-21 10:24:04.772056	\N	f	f
8ad00e9d-f827-4947-a8a6-aa9301c73697	studio	/studio	t	2026-06-21 10:24:04.882987	2026-06-21 10:24:04.882987	\N	f	f
f69884ad-a9c3-4dcb-9891-599a1dcc38fb	artists	/artists	t	2026-06-21 10:24:04.92194	2026-06-21 10:24:04.92194	\N	f	f
d64c47b6-7091-4aa0-8a2d-dd28821b0255	gallery	/gallery	t	2026-06-21 10:24:04.975862	2026-06-21 10:24:04.975862	\N	f	f
17b0edae-b37b-4393-a70d-0584457f89ee	blog	/blog	t	2026-06-21 10:24:05.023725	2026-06-21 10:24:05.023725	\N	f	f
da3890cc-c6fb-4317-8345-1408eae0985a	contact	/contact	t	2026-06-21 10:24:05.056372	2026-06-21 10:24:05.056372	\N	f	f
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.settings (id, key, value, type, "group", "createdAt", "updatedAt") FROM stdin;
1b61e0c7-88d9-4def-8ac5-c90a90924a97	address		string	contact	2026-06-21 10:24:04.258068	2026-06-21 10:24:04.258068
8e1145d7-23d1-4943-8e9c-18e90bc87f94	phone	+12125550199	string	contact	2026-06-21 10:24:04.36246	2026-06-21 10:24:04.36246
ca156134-ba3a-4def-a53f-0c53ce969089	whatsapp	+12125550199	string	contact	2026-06-21 10:24:04.377359	2026-06-21 10:24:04.377359
92e7334b-bada-4833-8ea1-2f63403d14e7	email	booking@nyctattoostudio.com	string	contact	2026-06-21 10:24:04.432711	2026-06-21 10:24:04.432711
49f8ccc2-6112-41f8-ae3e-06c4dea67846	instagram	https://instagram.com/nyctattoostudio	string	social	2026-06-21 10:24:04.459341	2026-06-21 10:24:04.459341
7e67da07-0f03-4a49-823f-43d6248c7665	facebook		string	social	2026-06-21 10:24:04.486418	2026-06-21 10:24:04.486418
7659bcb7-e42e-4755-8518-f288a2f1931c	tiktok		string	social	2026-06-21 10:24:04.504152	2026-06-21 10:24:04.504152
aedc1371-bb56-4fab-a12c-a1a3b594d95f	googleMapsLat		string	location	2026-06-21 10:24:04.525721	2026-06-21 10:24:04.525721
c917cc95-ba31-40cf-a6d5-8009e351b7f8	googleMapsLng		string	location	2026-06-21 10:24:04.555009	2026-06-21 10:24:04.555009
4762c717-28a5-48cb-a0b8-2c4b714f4e13	mondayHours		string	hours	2026-06-21 10:24:04.585923	2026-06-21 10:24:04.585923
bad2a517-525e-4533-89a7-2efcbc482c88	tuesdayHours		string	hours	2026-06-21 10:24:04.605904	2026-06-21 10:24:04.605904
495969ca-d6f7-4f2c-9764-c857d38a19b7	wednesdayHours		string	hours	2026-06-21 10:24:04.633008	2026-06-21 10:24:04.633008
5d6b3afd-ea94-4488-a2d0-3eff62889898	thursdayHours		string	hours	2026-06-21 10:24:04.653963	2026-06-21 10:24:04.653963
6a32e051-d5cb-4f73-901f-27ae658c20f2	fridayHours		string	hours	2026-06-21 10:24:04.686837	2026-06-21 10:24:04.686837
f348ad18-0f33-4985-92a8-2e94d4a0cd0a	saturdayHours		string	hours	2026-06-21 10:24:04.710686	2026-06-21 10:24:04.710686
4e67e331-e118-4a6e-8b41-061b359885ef	sundayHours		string	hours	2026-06-21 10:24:04.738476	2026-06-21 10:24:04.738476
73ecf9ed-5d14-478f-bce7-c1b6f996e898	studioName	La Rola Tattoo NYC	string	general	2026-06-21 10:24:04.196105	2026-06-22 05:20:44.050621
\.


--
-- Data for Name: tag_translations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag_translations (id, "tagId", "languageId", name) FROM stdin;
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (id, slug, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, "passwordHash", name, avatar, "isActive", "roleId", "createdAt", "updatedAt", "deletedAt") FROM stdin;
ed285a16-c4ef-4da3-9be6-4a3d5b3494e9	admin@salontatto.com	$2b$12$TlVF2R7O30h.LZiBz.bFg.n0kDUbtQ57ds8m9Ve2m2yfhRFVzgtzm	Admin	\N	t	fcecfc97-889a-42c4-8fb4-f1d581b231a5	2026-06-21 10:24:03.940518	2026-06-22 03:49:08.875163	\N
\.


--
-- Name: settings PK_0669fe20e252eb692bf4d344975; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY (id);


--
-- Name: artists PK_09b823d4607d2675dc4ffa82261; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artists
    ADD CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY (id);


--
-- Name: artist_translations PK_161ee05050190234a395d3ca8b0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist_translations
    ADD CONSTRAINT "PK_161ee05050190234a395d3ca8b0" PRIMARY KEY (id);


--
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- Name: seo_pages PK_2aeda7654601ab4fb8fdaa32a51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seo_pages
    ADD CONSTRAINT "PK_2aeda7654601ab4fb8fdaa32a51" PRIMARY KEY (id);


--
-- Name: promotions PK_380cecbbe3ac11f0e5a7c452c34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT "PK_380cecbbe3ac11f0e5a7c452c34" PRIMARY KEY (id);


--
-- Name: blog_post_categories PK_5d53d2c2c24508651641969047d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_post_categories
    ADD CONSTRAINT "PK_5d53d2c2c24508651641969047d" PRIMARY KEY ("blogPostsId", "categoriesId");


--
-- Name: blog_post_translations PK_67c1dffdb27a310d948e2a516fc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_post_translations
    ADD CONSTRAINT "PK_67c1dffdb27a310d948e2a516fc" PRIMARY KEY (id);


--
-- Name: tag_translations PK_6d541def9a3fbed4abeccd9f343; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_translations
    ADD CONSTRAINT "PK_6d541def9a3fbed4abeccd9f343" PRIMARY KEY (id);


--
-- Name: artist_images PK_9a25de6f62a50f54ce87b3cdbeb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist_images
    ADD CONSTRAINT "PK_9a25de6f62a50f54ce87b3cdbeb" PRIMARY KEY (id);


--
-- Name: category_translations PK_9dff018a4a26a924c60d3e86432; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_translations
    ADD CONSTRAINT "PK_9dff018a4a26a924c60d3e86432" PRIMARY KEY (id);


--
-- Name: blog_post_tags PK_a23b9367c7e7e40dbc31484f1f7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_post_tags
    ADD CONSTRAINT "PK_a23b9367c7e7e40dbc31484f1f7" PRIMARY KEY ("blogPostsId", "tagsId");


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: languages PK_b517f827ca496b29f4d549c631d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY (id);


--
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- Name: blog_posts PK_dd2add25eac93daefc93da9d387; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT "PK_dd2add25eac93daefc93da9d387" PRIMARY KEY (id);


--
-- Name: tags PK_e7dc17249a1148a1970748eda99; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY (id);


--
-- Name: seo_page_translations PK_ed4b4913aa4310b390d0b62c278; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seo_page_translations
    ADD CONSTRAINT "PK_ed4b4913aa4310b390d0b62c278" PRIMARY KEY (id);


--
-- Name: blog_post_translations UQ_38372561687a10bc38121893e94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_post_translations
    ADD CONSTRAINT "UQ_38372561687a10bc38121893e94" UNIQUE ("blogPostId", "languageId");


--
-- Name: categories UQ_420d9f679d41281f282f5bc7d09; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE (slug);


--
-- Name: seo_page_translations UQ_470c5128e9bc86958200a603af8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seo_page_translations
    ADD CONSTRAINT "UQ_470c5128e9bc86958200a603af8" UNIQUE ("seoPageId", "languageId");


--
-- Name: artist_translations UQ_50567313d6b0ff13fb96ec7c7ad; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist_translations
    ADD CONSTRAINT "UQ_50567313d6b0ff13fb96ec7c7ad" UNIQUE ("artistId", "languageId");


--
-- Name: blog_posts UQ_5b2818a2c45c3edb9991b1c7a51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT "UQ_5b2818a2c45c3edb9991b1c7a51" UNIQUE (slug);


--
-- Name: seo_pages UQ_5c46fc2e9030b37c77c7b45d9a8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seo_pages
    ADD CONSTRAINT "UQ_5c46fc2e9030b37c77c7b45d9a8" UNIQUE ("pageKey");


--
-- Name: roles UQ_648e3f5447f725579d7d4ffdfb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE (name);


--
-- Name: tag_translations UQ_7068f4afe9c87fd1d0f84be3264; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_translations
    ADD CONSTRAINT "UQ_7068f4afe9c87fd1d0f84be3264" UNIQUE ("tagId", "languageId");


--
-- Name: languages UQ_7397752718d1c9eb873722ec9b2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT "UQ_7397752718d1c9eb873722ec9b2" UNIQUE (code);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: category_translations UQ_a39d693127f8978714424c76b88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_translations
    ADD CONSTRAINT "UQ_a39d693127f8978714424c76b88" UNIQUE ("categoryId", "languageId");


--
-- Name: tags UQ_b3aa10c29ea4e61a830362bd25a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT "UQ_b3aa10c29ea4e61a830362bd25a" UNIQUE (slug);


--
-- Name: settings UQ_c8639b7626fa94ba8265628f214; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT "UQ_c8639b7626fa94ba8265628f214" UNIQUE (key);


--
-- Name: artists UQ_d8698856b9f9735db7470841363; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artists
    ADD CONSTRAINT "UQ_d8698856b9f9735db7470841363" UNIQUE (slug);


--
-- Name: IDX_031a5f4d52af3848a82c86a764; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_031a5f4d52af3848a82c86a764" ON public.languages USING btree ("isActive");


--
-- Name: IDX_09269227c7acf3cdf47ea4051e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_09269227c7acf3cdf47ea4051e" ON public.blog_posts USING btree ("authorId");


--
-- Name: IDX_21bf09d63671740127a51b51c5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_21bf09d63671740127a51b51c5" ON public.artists USING btree ("isActive");


--
-- Name: IDX_27ee51a78e8cb35958072441f5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_27ee51a78e8cb35958072441f5" ON public.artist_images USING btree ("isFeatured");


--
-- Name: IDX_2b6eee07e0501c4135927595f6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_2b6eee07e0501c4135927595f6" ON public.blog_post_tags USING btree ("tagsId");


--
-- Name: IDX_368e146b785b574f42ae9e53d5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_368e146b785b574f42ae9e53d5" ON public.users USING btree ("roleId");


--
-- Name: IDX_3e136c336358a2ea03414adfa0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3e136c336358a2ea03414adfa0" ON public.artist_images USING btree ("categoryId");


--
-- Name: IDX_45509cc49b36b76935300060e3; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_45509cc49b36b76935300060e3" ON public.blog_posts USING btree (status);


--
-- Name: IDX_45b3a520832fb0a54698202d9b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_45b3a520832fb0a54698202d9b" ON public.artist_images USING btree ("artistId");


--
-- Name: IDX_50567313d6b0ff13fb96ec7c7a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_50567313d6b0ff13fb96ec7c7a" ON public.artist_translations USING btree ("artistId", "languageId");


--
-- Name: IDX_54a1faad60e1268b4c53d1ec49; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_54a1faad60e1268b4c53d1ec49" ON public.blog_post_tags USING btree ("blogPostsId");


--
-- Name: IDX_5b2818a2c45c3edb9991b1c7a5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_5b2818a2c45c3edb9991b1c7a5" ON public.blog_posts USING btree (slug);


--
-- Name: IDX_65a5ad6e2d4368b9da77b3adc7; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_65a5ad6e2d4368b9da77b3adc7" ON public.artists USING btree ("orderIndex");


--
-- Name: IDX_7397752718d1c9eb873722ec9b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_7397752718d1c9eb873722ec9b" ON public.languages USING btree (code);


--
-- Name: IDX_97672ac88f789774dd47f7c8be; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON public.users USING btree (email);


--
-- Name: IDX_be1c80305e1b11c0a119aa190c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_be1c80305e1b11c0a119aa190c" ON public.blog_posts USING btree ("publishedAt");


--
-- Name: IDX_ca1395b059aeaeaa079de450ca; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_ca1395b059aeaeaa079de450ca" ON public.blog_post_categories USING btree ("categoriesId");


--
-- Name: IDX_d8698856b9f9735db747084136; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_d8698856b9f9735db747084136" ON public.artists USING btree (slug);


--
-- Name: IDX_e7b415451a3917f8a07aacdf36; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e7b415451a3917f8a07aacdf36" ON public.blog_post_categories USING btree ("blogPostsId");


--
-- Name: blog_posts FK_09269227c7acf3cdf47ea4051e1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT "FK_09269227c7acf3cdf47ea4051e1" FOREIGN KEY ("authorId") REFERENCES public.users(id);


--
-- Name: tag_translations FK_0b845fe2553fd0aa2e2776e05a2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_translations
    ADD CONSTRAINT "FK_0b845fe2553fd0aa2e2776e05a2" FOREIGN KEY ("languageId") REFERENCES public.languages(id) ON DELETE CASCADE;


--
-- Name: blog_post_tags FK_2b6eee07e0501c4135927595f61; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_post_tags
    ADD CONSTRAINT "FK_2b6eee07e0501c4135927595f61" FOREIGN KEY ("tagsId") REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blog_post_translations FK_2be2c46d2e566673f6a4f389fe5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_post_translations
    ADD CONSTRAINT "FK_2be2c46d2e566673f6a4f389fe5" FOREIGN KEY ("blogPostId") REFERENCES public.blog_posts(id) ON DELETE CASCADE;


--
-- Name: users FK_368e146b785b574f42ae9e53d5e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES public.roles(id);


--
-- Name: artist_images FK_3e136c336358a2ea03414adfa02; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist_images
    ADD CONSTRAINT "FK_3e136c336358a2ea03414adfa02" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: artist_images FK_45b3a520832fb0a54698202d9ba; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist_images
    ADD CONSTRAINT "FK_45b3a520832fb0a54698202d9ba" FOREIGN KEY ("artistId") REFERENCES public.artists(id) ON DELETE CASCADE;


--
-- Name: blog_post_tags FK_54a1faad60e1268b4c53d1ec490; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_post_tags
    ADD CONSTRAINT "FK_54a1faad60e1268b4c53d1ec490" FOREIGN KEY ("blogPostsId") REFERENCES public.blog_posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tag_translations FK_62360de74512bcd2294b9bcb549; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_translations
    ADD CONSTRAINT "FK_62360de74512bcd2294b9bcb549" FOREIGN KEY ("tagId") REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- Name: artist_translations FK_807f528dc55f0ad6e0fa351c16b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist_translations
    ADD CONSTRAINT "FK_807f528dc55f0ad6e0fa351c16b" FOREIGN KEY ("artistId") REFERENCES public.artists(id) ON DELETE CASCADE;


--
-- Name: seo_page_translations FK_a9f08f0ac3d1c5c20b14057674b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seo_page_translations
    ADD CONSTRAINT "FK_a9f08f0ac3d1c5c20b14057674b" FOREIGN KEY ("languageId") REFERENCES public.languages(id) ON DELETE CASCADE;


--
-- Name: seo_page_translations FK_ba11c182c19c5894299d13fae8e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seo_page_translations
    ADD CONSTRAINT "FK_ba11c182c19c5894299d13fae8e" FOREIGN KEY ("seoPageId") REFERENCES public.seo_pages(id) ON DELETE CASCADE;


--
-- Name: artist_translations FK_bb34859795e0a19a24a7ffc0c2d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist_translations
    ADD CONSTRAINT "FK_bb34859795e0a19a24a7ffc0c2d" FOREIGN KEY ("languageId") REFERENCES public.languages(id) ON DELETE CASCADE;


--
-- Name: blog_post_categories FK_ca1395b059aeaeaa079de450cac; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_post_categories
    ADD CONSTRAINT "FK_ca1395b059aeaeaa079de450cac" FOREIGN KEY ("categoriesId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: category_translations FK_ce584bbf6422e668ff001e30cb0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_translations
    ADD CONSTRAINT "FK_ce584bbf6422e668ff001e30cb0" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: blog_post_categories FK_e7b415451a3917f8a07aacdf36a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_post_categories
    ADD CONSTRAINT "FK_e7b415451a3917f8a07aacdf36a" FOREIGN KEY ("blogPostsId") REFERENCES public.blog_posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blog_post_translations FK_e85f704a0d30db7f92398d75885; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_post_translations
    ADD CONSTRAINT "FK_e85f704a0d30db7f92398d75885" FOREIGN KEY ("languageId") REFERENCES public.languages(id) ON DELETE CASCADE;


--
-- Name: category_translations FK_fd314b008f27a0c906f7b7460ca; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_translations
    ADD CONSTRAINT "FK_fd314b008f27a0c906f7b7460ca" FOREIGN KEY ("languageId") REFERENCES public.languages(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

