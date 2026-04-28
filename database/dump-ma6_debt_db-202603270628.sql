--
-- PostgreSQL database dump
--

\restrict scqqXzaAb5L9RZxX3Xwj9TCHs8K6bH31AZdHzXOnOJoyr0iOmUifhz8Qb3edbAN

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2026-03-27 06:28:07

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

DROP DATABASE ma6_debt_db;
--
-- TOC entry 5062 (class 1262 OID 76842)
-- Name: ma6_debt_db; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE ma6_debt_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United Kingdom.1252';


\unrestrict scqqXzaAb5L9RZxX3Xwj9TCHs8K6bH31AZdHzXOnOJoyr0iOmUifhz8Qb3edbAN
\connect ma6_debt_db
\restrict scqqXzaAb5L9RZxX3Xwj9TCHs8K6bH31AZdHzXOnOJoyr0iOmUifhz8Qb3edbAN

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 76843)
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."__EFMigrationsHistory" (
    migration_id character varying(150) NOT NULL,
    product_version character varying(32) NOT NULL
);


--
-- TOC entry 221 (class 1259 OID 77262)
-- Name: debt_partners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.debt_partners (
    id uuid CONSTRAINT "DebtPartners_Id_not_null" NOT NULL,
    user_id uuid CONSTRAINT "DebtPartners_UserId_not_null" NOT NULL,
    name text CONSTRAINT "DebtPartners_Name_not_null" NOT NULL,
    balance numeric CONSTRAINT "DebtPartners_InitialBalance_not_null" NOT NULL,
    is_deleted boolean CONSTRAINT "DebtPartners_IsDeleted_not_null" NOT NULL,
    created_at timestamp with time zone CONSTRAINT "DebtPartners_CreatedAt_not_null" NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 77302)
-- Name: transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions (
    id uuid CONSTRAINT "Transactions_Id_not_null" NOT NULL,
    wallet_id uuid CONSTRAINT "Transactions_WalletId_not_null" NOT NULL,
    partner_id uuid,
    amount numeric CONSTRAINT "Transactions_Amount_not_null" NOT NULL,
    note text,
    transaction_date timestamp with time zone CONSTRAINT "Transactions_TransactionDate_not_null" NOT NULL,
    created_at timestamp with time zone CONSTRAINT "Transactions_CreatedAt_not_null" NOT NULL,
    debt_amount numeric,
    partner_balance_after numeric,
    partner_balance_before numeric,
    payer_mode integer,
    total_amount numeric
);


--
-- TOC entry 224 (class 1259 OID 77324)
-- Name: transfers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transfers (
    id uuid CONSTRAINT "Transfers_Id_not_null" NOT NULL,
    from_wallet_id uuid CONSTRAINT "Transfers_FromWalletId_not_null" NOT NULL,
    to_wallet_id uuid CONSTRAINT "Transfers_ToWalletId_not_null" NOT NULL,
    amount numeric CONSTRAINT "Transfers_Amount_not_null" NOT NULL,
    transfer_date timestamp with time zone CONSTRAINT "Transfers_TransferDate_not_null" NOT NULL,
    created_at timestamp with time zone CONSTRAINT "Transfers_CreatedAt_not_null" NOT NULL,
    destination_transaction_id uuid,
    source_transaction_id uuid,
    user_id uuid DEFAULT '00000000-0000-0000-0000-000000000000'::uuid NOT NULL
);


--
-- TOC entry 220 (class 1259 OID 77251)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid CONSTRAINT "Users_Id_not_null" NOT NULL,
    username text CONSTRAINT "Users_Username_not_null" NOT NULL,
    password_hash text CONSTRAINT "Users_PasswordHash_not_null" NOT NULL,
    name text,
    email text,
    default_wallet_id uuid,
    default_partner_id uuid,
    created_at timestamp with time zone CONSTRAINT "Users_CreatedAt_not_null" NOT NULL
);


--
-- TOC entry 222 (class 1259 OID 77281)
-- Name: wallets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wallets (
    id uuid CONSTRAINT "Wallets_Id_not_null" NOT NULL,
    user_id uuid CONSTRAINT "Wallets_UserId_not_null" NOT NULL,
    parent_wallet_id uuid,
    name text CONSTRAINT "Wallets_Name_not_null" NOT NULL,
    description text,
    created_at timestamp with time zone CONSTRAINT "Wallets_CreatedAt_not_null" NOT NULL
);


--
-- TOC entry 5051 (class 0 OID 76843)
-- Dependencies: 219
-- Data for Name: __EFMigrationsHistory; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."__EFMigrationsHistory" VALUES ('20260208102938_InitialCreate', '9.0.12');
INSERT INTO public."__EFMigrationsHistory" VALUES ('20260208103321_initDB', '9.0.12');
INSERT INTO public."__EFMigrationsHistory" VALUES ('20260214092505_DebtPartnersSignedInitialBalanceDropType', '9.0.12');
INSERT INTO public."__EFMigrationsHistory" VALUES ('20260214192826_ConvertToSnakeCaseAndRenameBalance', '9.0.12');
INSERT INTO public."__EFMigrationsHistory" VALUES ('20260215064000_AddUs03TransactionFields', '9.0.12');
INSERT INTO public."__EFMigrationsHistory" VALUES ('20260221164624_transfer-wallet', '9.0.12');


--
-- TOC entry 5053 (class 0 OID 77262)
-- Dependencies: 221
-- Data for Name: debt_partners; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.debt_partners VALUES ('ef1a2cac-d9be-4e82-8cec-2e9d736c7b6e', 'eb78f0f6-fcd1-477a-b134-20edaf779763', 'Nguyễn Văn A', 0, false, '2026-02-15 02:39:49.626037+07');
INSERT INTO public.debt_partners VALUES ('75e69f55-b559-41d0-a884-24c071f895e5', '5a91eff9-f362-4c75-a9c6-01c870a54f15', 'abc', -2222, true, '2026-02-16 11:49:49.942046+07');
INSERT INTO public.debt_partners VALUES ('47121480-e718-41a6-9af8-3d48a07e60cd', '5a91eff9-f362-4c75-a9c6-01c870a54f15', 'Hihi', 2222, true, '2026-02-21 22:41:33.212854+07');
INSERT INTO public.debt_partners VALUES ('8bd51767-d791-44a8-86ab-19793d4ec9be', '5a91eff9-f362-4c75-a9c6-01c870a54f15', 'Ông cA', 1210001, true, '2026-02-15 17:14:17.505924+07');
INSERT INTO public.debt_partners VALUES ('f4dab598-0da3-4d29-b4a5-8ede310cd870', '5a91eff9-f362-4c75-a9c6-01c870a54f15', 'Ông B', 1000000, true, '2026-02-15 12:07:55.790557+07');
INSERT INTO public.debt_partners VALUES ('4a9d7413-b749-4441-b823-9562a601368b', '5a91eff9-f362-4c75-a9c6-01c870a54f15', 'Chị A', 0, true, '2026-02-26 23:20:02.441672+07');
INSERT INTO public.debt_partners VALUES ('d36955bd-38e5-43bb-b759-53665dbc91b1', '5a91eff9-f362-4c75-a9c6-01c870a54f15', 'Chị B', 0, true, '2026-03-01 02:39:54.078701+07');
INSERT INTO public.debt_partners VALUES ('fdd35514-c6e9-4eb5-b672-384abb6369dd', '5a91eff9-f362-4c75-a9c6-01c870a54f15', 'Ông A', -22229877, true, '2026-02-15 12:07:32.28723+07');
INSERT INTO public.debt_partners VALUES ('81712d7d-ee60-430b-be3f-5c761356d2cf', '5a91eff9-f362-4c75-a9c6-01c870a54f15', 'hihi', 0, false, '2026-03-02 04:59:24.251402+07');
INSERT INTO public.debt_partners VALUES ('2632ff62-5499-48ed-a06e-2f08e1680669', '5a91eff9-f362-4c75-a9c6-01c870a54f15', 'Chị A', 90000, false, '2026-03-02 04:19:46.601793+07');
INSERT INTO public.debt_partners VALUES ('0ef00445-c049-4616-9413-e61366d6f0ad', 'c5d9877a-5904-4be1-ab9d-871ab0c25f63', 'Nghĩa béo', 205000, false, '2026-03-23 09:05:49.285066+07');


--
-- TOC entry 5055 (class 0 OID 77302)
-- Dependencies: 223
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.transactions VALUES ('8e99e431-feca-43b5-99f5-7d81b6fe830f', 'd827f649-230c-47df-9568-658bf4a5ef0e', NULL, -1000, NULL, '2026-02-15 14:03:42.656269+07', '2026-02-15 14:03:42.656348+07', NULL, NULL, NULL, 0, 1000);
INSERT INTO public.transactions VALUES ('b4cd260c-4372-4971-a83e-1d68a72a6920', 'd827f649-230c-47df-9568-658bf4a5ef0e', NULL, 0, NULL, '2026-02-15 14:08:29.619608+07', '2026-02-15 14:08:29.619609+07', NULL, NULL, NULL, 1, 1000);
INSERT INTO public.transactions VALUES ('b4a65727-3f31-47cf-b4db-1ba3824f51e3', 'd827f649-230c-47df-9568-658bf4a5ef0e', NULL, 0, NULL, '2026-02-15 14:08:32.498572+07', '2026-02-15 14:08:32.498572+07', NULL, NULL, NULL, 1, 1000);
INSERT INTO public.transactions VALUES ('33987564-18f9-467a-a907-7eae19e63557', 'd827f649-230c-47df-9568-658bf4a5ef0e', NULL, 0, NULL, '2026-02-15 14:08:33.350883+07', '2026-02-15 14:08:33.350883+07', NULL, NULL, NULL, 1, 1000);
INSERT INTO public.transactions VALUES ('53f4bf08-8fd2-46a2-b49b-b8acb735c72c', 'd827f649-230c-47df-9568-658bf4a5ef0e', NULL, -1000, NULL, '2026-02-15 14:36:12.64114+07', '2026-02-15 14:36:12.641195+07', NULL, NULL, NULL, 0, 1000);
INSERT INTO public.transactions VALUES ('c4abf292-01ad-4efd-b25e-aa50c6177d73', 'd827f649-230c-47df-9568-658bf4a5ef0e', NULL, -1000, NULL, '2026-02-15 15:07:20.560624+07', '2026-02-15 15:07:20.560624+07', NULL, NULL, NULL, 0, 1000);
INSERT INTO public.transactions VALUES ('3efa2380-4473-47a5-88fa-b012d27b12fd', 'd827f649-230c-47df-9568-658bf4a5ef0e', NULL, -10000, 'ăn cá viên', '2026-02-15 15:08:05.281088+07', '2026-02-15 15:08:05.281088+07', NULL, NULL, NULL, 0, 10000);
INSERT INTO public.transactions VALUES ('0a93cded-b95d-4df7-8a0e-ed14acc41566', 'd827f649-230c-47df-9568-658bf4a5ef0e', NULL, -50000, 'mua sữa', '2026-02-15 15:08:22.742496+07', '2026-02-15 15:08:22.742496+07', NULL, NULL, NULL, 0, 50000);
INSERT INTO public.transactions VALUES ('5409b297-be40-400d-9cd3-58ecf286740e', '4511b398-c328-4c6c-86f3-8672a4dbccde', 'ef1a2cac-d9be-4e82-8cec-2e9d736c7b6e', -1000, NULL, '2026-02-15 16:29:05.032265+07', '2026-02-15 16:29:05.032265+07', NULL, 0, 0, 0, 1000);
INSERT INTO public.transactions VALUES ('c88e3103-887b-4f52-b273-a2a52e81fe65', '4511b398-c328-4c6c-86f3-8672a4dbccde', NULL, -50000, 'mua sữa', '2026-02-15 16:29:32.443719+07', '2026-02-15 16:29:32.443719+07', NULL, NULL, NULL, 0, 50000);
INSERT INTO public.transactions VALUES ('03b73f6b-a7cf-48f6-93b5-56be7b188534', '4511b398-c328-4c6c-86f3-8672a4dbccde', NULL, -50000, 'mua sữa', '2026-02-20 14:29:37.924157+07', '2026-02-20 14:29:37.924198+07', NULL, NULL, NULL, 0, 50000);
INSERT INTO public.transactions VALUES ('f50978b2-38bc-4448-a955-0249abcee81a', '4511b398-c328-4c6c-86f3-8672a4dbccde', NULL, -50000, 'mua sữa', '2026-02-20 14:52:52.647782+07', '2026-02-20 14:52:52.647782+07', NULL, NULL, NULL, 0, 50000);
INSERT INTO public.transactions VALUES ('bf7e66ad-454e-4df5-8525-1f4065f95751', 'd827f649-230c-47df-9568-658bf4a5ef0e', NULL, 1000, 'mom give', '2026-02-20 14:54:06.202761+07', '2026-02-20 14:54:06.202761+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('dd838cab-6695-4f80-ada2-7c8e39ac2559', 'd827f649-230c-47df-9568-658bf4a5ef0e', NULL, 100000, 'mom give', '2026-02-20 14:54:28.57837+07', '2026-02-20 14:54:28.57837+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('74bdd6c6-2d64-4001-9b42-63ab75f50650', '4511b398-c328-4c6c-86f3-8672a4dbccde', NULL, 100000, 'mom give', '2026-02-20 14:59:29.037829+07', '2026-02-20 14:59:29.037829+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('b07e78b9-d8f9-4bf7-8002-c0796b161fd1', '4511b398-c328-4c6c-86f3-8672a4dbccde', NULL, -100000, 'mom give', '2026-02-20 15:00:30.246222+07', '2026-02-20 15:00:30.246222+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('577c7faa-a0e2-441c-8620-18da8b68a886', '18f0850b-aab4-4d66-a822-b5024697a43b', 'fdd35514-c6e9-4eb5-b672-384abb6369dd', -1000, NULL, '2026-02-23 09:22:50.752577+07', '2026-02-23 09:22:50.75262+07', NULL, -22222222, -22222222, 0, 1000);
INSERT INTO public.transactions VALUES ('e60b3052-b3de-4a42-a670-c75e15b58802', '18f0850b-aab4-4d66-a822-b5024697a43b', 'fdd35514-c6e9-4eb5-b672-384abb6369dd', -1000, NULL, '2026-02-23 09:23:54.906688+07', '2026-02-23 09:23:54.906688+07', NULL, -22222222, -22222222, 0, 1000);
INSERT INTO public.transactions VALUES ('74c10145-729a-4132-afeb-a87c0734f035', '18f0850b-aab4-4d66-a822-b5024697a43b', 'fdd35514-c6e9-4eb5-b672-384abb6369dd', -10000, NULL, '2026-02-23 09:24:02.298714+07', '2026-02-23 09:24:02.298714+07', NULL, -22222222, -22222222, 0, 10000);
INSERT INTO public.transactions VALUES ('14311593-fdd7-48c9-9c75-6eb1559e5689', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -50000, 'mua sữa', '2026-02-23 09:26:01.167507+07', '2026-02-23 09:26:01.167508+07', NULL, NULL, NULL, 0, 50000);
INSERT INTO public.transactions VALUES ('4d72cf4f-bece-45db-b5c0-099dbacdd989', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -1000, NULL, '2026-02-23 10:04:12.033829+07', '2026-02-23 10:04:12.033829+07', NULL, NULL, NULL, 0, 1000);
INSERT INTO public.transactions VALUES ('30d73164-943b-4075-8ce6-929aabab4072', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -10000, NULL, '2026-02-23 10:04:17.580785+07', '2026-02-23 10:04:17.580785+07', NULL, NULL, NULL, 0, 10000);
INSERT INTO public.transactions VALUES ('b9485605-280a-469d-84d0-4c302318fadd', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -10000, NULL, '2026-02-23 10:04:18.944629+07', '2026-02-23 10:04:18.944629+07', NULL, NULL, NULL, 0, 10000);
INSERT INTO public.transactions VALUES ('c2e017e8-4425-44d4-b829-123635d84fa0', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -10000, NULL, '2026-02-23 10:04:19.833099+07', '2026-02-23 10:04:19.833099+07', NULL, NULL, NULL, 0, 10000);
INSERT INTO public.transactions VALUES ('a89c72c5-b258-4a64-af6a-9e395e0bc373', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, 10000, 'mom give', '2026-02-23 10:05:20.416355+07', '2026-02-23 10:05:20.416355+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('d52cc6b5-2be7-4fba-bdd1-925505ab04be', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, 10000, 'mom give', '2026-02-23 10:05:20.931243+07', '2026-02-23 10:05:20.931243+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('93ad7d9a-1265-441f-82e8-f001c3d9de48', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, 10000, 'mom give', '2026-02-23 10:05:21.399301+07', '2026-02-23 10:05:21.399302+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('df49714e-4edf-4f05-bf64-69243d329e8e', '4511b398-c328-4c6c-86f3-8672a4dbccde', NULL, 100000, 'mom give', '2025-02-20 15:00:48.567+07', '2026-02-20 15:00:48.567848+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('56f38e8d-4a71-4043-8084-a3fbdfb6e641', 'b6c0d072-f094-46eb-b214-8183f2e669a2', NULL, 20000, 'Transfer from wallet 18f0850b-aab4-4d66-a822-b5024697a43b', '2026-02-24 00:51:59.237929+07', '2026-02-24 00:51:59.2386+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('b1ce5731-1df5-4f1b-ba50-d030ba9e6b8f', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -20000, 'Transfer to wallet b6c0d072-f094-46eb-b214-8183f2e669a2', '2026-02-24 00:51:59.237929+07', '2026-02-24 00:51:59.238393+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('d265df29-fc7f-4afd-94d0-9996c7de0301', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -10000, NULL, '2025-02-23 10:04:21.719+07', '2026-02-23 10:04:21.719643+07', NULL, NULL, NULL, 0, 10000);
INSERT INTO public.transactions VALUES ('82cd4e03-6186-4632-92f7-b535b67be3a2', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -100000, 'mom giveeeee', '2026-02-23 10:05:25.000873+07', '2026-02-23 10:05:25.000873+07', NULL, NULL, NULL, 0, 100000);
INSERT INTO public.transactions VALUES ('5bb86df1-027f-41c3-a549-1b0a8bb9e24d', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, 1000000, 'mom give', '2026-02-23 10:05:18.933502+07', '2026-02-23 10:05:18.933502+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('6c1af939-1c74-4a05-b421-1796306e62b3', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -10000, 'Transfer to wallet 9e18c727-e81c-4ce2-8d35-8f76e347bc1d', '2026-02-24 04:02:52.487992+07', '2026-02-24 04:02:52.488675+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('d161119b-54e6-4b47-b0fa-c86107969981', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', NULL, 10000, 'Transfer from wallet 18f0850b-aab4-4d66-a822-b5024697a43b', '2026-02-24 04:02:52.487992+07', '2026-02-24 04:02:52.488804+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('4e26fba1-d442-47f2-9a73-c9d24a332ac1', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', NULL, -10000, 'Transfer to wallet 18f0850b-aab4-4d66-a822-b5024697a43b', '2026-02-24 04:04:24.772634+07', '2026-02-24 04:04:24.772642+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('30a21c24-a437-4c8e-96c5-b7c5beb57ad5', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -20000, 'Transfer to wallet 9e18c727-e81c-4ce2-8d35-8f76e347bc1d', '2026-02-24 04:04:45.113627+07', '2026-02-24 04:04:45.113632+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('b7f798e2-1e3c-4f1c-ae26-c4874c082474', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', NULL, 20000, 'Transfer from wallet 18f0850b-aab4-4d66-a822-b5024697a43b', '2026-02-24 04:04:45.113627+07', '2026-02-24 04:04:45.11364+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('6a3a95ef-7206-46ae-9564-61af2752c95f', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -10000, 'Transfer to wallet 9e18c727-e81c-4ce2-8d35-8f76e347bc1d', '2026-02-24 04:19:18.277371+07', '2026-02-24 04:19:18.277378+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('af24e3d1-344b-4b8c-b074-61f203ceee35', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', NULL, 10000, 'Transfer from wallet 18f0850b-aab4-4d66-a822-b5024697a43b', '2026-02-24 04:19:18.277371+07', '2026-02-24 04:19:18.277384+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('b1edb1f1-cb35-442c-9aa0-db55acc8ae41', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -10000, 'Transfer to wallet 9e18c727-e81c-4ce2-8d35-8f76e347bc1d', '2026-02-24 04:19:35.055725+07', '2026-02-24 04:19:35.05573+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('15dc119c-3d32-452a-80c5-66bb042eafb4', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -20000, 'Transfer to wallet 9e18c727-e81c-4ce2-8d35-8f76e347bc1d', '2026-02-24 04:30:31.749288+07', '2026-02-24 04:30:31.749297+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('593953f0-aaaf-4b2c-a920-bc4a0f81bac8', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', NULL, 20000, 'Transfer from wallet 18f0850b-aab4-4d66-a822-b5024697a43b', '2026-02-24 04:30:31.749288+07', '2026-02-24 04:30:31.749309+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('4095c7d7-bbdc-42ac-9dde-3eeb785c8ec1', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -20000, 'Transfer to wallet 9e18c727-e81c-4ce2-8d35-8f76e347bc1d', '2026-02-24 04:30:40.535255+07', '2026-02-24 04:30:40.535261+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('a996af65-2680-471c-94b5-793067611979', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', NULL, 20000, 'Transfer from wallet 18f0850b-aab4-4d66-a822-b5024697a43b', '2026-02-24 04:30:40.535255+07', '2026-02-24 04:30:40.535267+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('c3a1b1de-4ef6-4945-bb43-a9de0a987074', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, 80000, 'Transfer from wallet 9e18c727-e81c-4ce2-8d35-8f76e347bc1d', '2026-02-24 04:30:52.891706+07', '2026-02-24 04:30:52.89172+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('d4e15205-8e55-4011-b410-bea8e4be2cf2', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', NULL, -80000, 'Transfer to wallet 18f0850b-aab4-4d66-a822-b5024697a43b', '2026-02-24 04:30:52.891706+07', '2026-02-24 04:30:52.891714+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('3f296559-5bb9-4c1a-b298-e93dbcd1f87e', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -22222, 'Transfer to wallet 9e18c727-e81c-4ce2-8d35-8f76e347bc1d', '2026-02-24 04:37:58.242717+07', '2026-02-24 04:37:58.242721+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('72df8a06-daae-4c8e-9bee-e60c1e9a8e17', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', NULL, 22222, 'Transfer from wallet 18f0850b-aab4-4d66-a822-b5024697a43b', '2026-02-24 04:37:58.242717+07', '2026-02-24 04:37:58.242726+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('cab5801e-2199-4891-a485-a4070b2c2d7d', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', NULL, 22222, 'Transfer from Ăn ngoài', '2026-02-24 05:48:33.638958+07', '2026-02-24 05:48:33.639755+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('96bf3235-5e68-4f99-8519-09da583c8ef9', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', NULL, 11111, 'Transfer from wallet 18f0850b-aab4-4d66-a822-b5024697a43b', '2026-02-24 12:29:46.8302+07', '2026-02-24 12:29:46.830833+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('c5292dc0-049e-48e3-846d-5e8877e3f936', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', NULL, 11111, 'Transfer from wallet 18f0850b-aab4-4d66-a822-b5024697a43b', '2026-02-24 12:30:00.023086+07', '2026-02-24 12:30:00.023099+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('0dc62cde-1eed-4b20-a8e4-cf9dfce8128b', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, 1234, 'Transfer from wallet 9e18c727-e81c-4ce2-8d35-8f76e347bc1d', '2026-02-26 11:15:45.40042+07', '2026-02-26 11:15:45.401073+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('ffd76173-751d-4bb9-bbe6-163bc808b7b7', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', NULL, -1234, 'Transfer to wallet 18f0850b-aab4-4d66-a822-b5024697a43b', '2026-02-26 11:15:45.40042+07', '2026-02-26 11:15:45.40085+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('2e5e709f-e7a0-4254-8c9c-0d533c2db77c', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -70000, 'Transfer to wallet e0e860c5-6af2-459e-915a-f9a9159caa9c', '2026-02-26 11:18:11.148552+07', '2026-02-26 11:18:11.148558+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('8bb2dbff-403e-4ea9-a88c-0afe6acb938b', 'e0e860c5-6af2-459e-915a-f9a9159caa9c', NULL, 70000, 'Transfer from wallet 18f0850b-aab4-4d66-a822-b5024697a43b', '2026-02-26 11:18:11.148552+07', '2026-02-26 11:18:11.148567+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('80ab3ed0-6cbf-483a-bda7-7ac2b3bc3f93', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -10000, 'Transfer to wallet 9e18c727-e81c-4ce2-8d35-8f76e347bc1d', '2026-02-26 11:23:53.660144+07', '2026-02-26 11:23:53.660689+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('8330bb39-e88d-422b-8c6a-72dab8e7637c', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -22222, 'Transfer to abcabc', '2025-07-24 05:48:33.638+07', '2026-02-24 05:48:33.639575+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('a3ca2d05-191d-4eaa-b117-9323ff021e72', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -11111, 'Transfer to wallet 9e18c727-e81c-4ce2-8d35-8f76e347bc1d', '2026-01-24 12:30:00.023+07', '2026-02-24 12:30:00.023092+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('09b82f2b-d362-4b1d-9d0a-f675a42e762d', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', NULL, 10000, 'Transfer from wallet 18f0850b-aab4-4d66-a822-b5024697a43b', '2026-01-24 04:19:35.055+07', '2026-02-24 04:19:35.055736+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('1bdde552-3035-4481-8eb0-5de4673f8c8f', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, 10000, 'Transfer from wallet 9e18c727-e81c-4ce2-8d35-8f76e347bc1d', '2025-04-24 04:04:24.772+07', '2026-02-24 04:04:24.772651+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('a05f0fed-db48-43b2-b106-e7c146917420', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', NULL, 10000, 'Transfer from wallet 18f0850b-aab4-4d66-a822-b5024697a43b', '2026-02-26 11:23:53.660144+07', '2026-02-26 11:23:53.660908+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('3f20c176-681e-4249-b0cb-87ef84e12676', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', NULL, 10000, 'Transfer from wallet 18f0850b-aab4-4d66-a822-b5024697a43b', '2026-02-26 11:28:05.938506+07', '2026-02-26 11:28:05.938516+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('e80bb702-9bcf-42df-9825-71677cc4efac', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -10000, 'Transfer to wallet 9e18c727-e81c-4ce2-8d35-8f76e347bc1d', '2026-02-26 11:28:05.938506+07', '2026-02-26 11:28:05.938511+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('92dfc294-f9c5-47aa-b538-515846a99fe9', 'b6c0d072-f094-46eb-b214-8183f2e669a2', NULL, 10000, 'Transfer from Ăn ngoài', '2026-02-26 11:29:19.760361+07', '2026-02-26 11:29:19.761426+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('adbe49c5-38d0-4c0d-b5e4-63b77ed9bf27', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -10000, 'Transfer to hihi', '2026-02-26 11:29:19.760361+07', '2026-02-26 11:29:19.761243+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('4c30bbc8-2e58-4c03-84ed-8149b68146de', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', 'fdd35514-c6e9-4eb5-b672-384abb6369dd', 0, 'help', '2026-02-26 23:06:38.121648+07', '2026-02-26 23:06:38.121648+07', 12345, -22229877, -22222222, 1, 20000);
INSERT INTO public.transactions VALUES ('cfc7362e-a11b-4e77-aa36-b28380ec43cc', '18f0850b-aab4-4d66-a822-b5024697a43b', '2632ff62-5499-48ed-a06e-2f08e1680669', -1000000, 'a hihi', '2026-03-02 07:48:35.383888+07', '2026-03-02 07:48:35.383889+07', 200000, 200000, 0, 0, 1000000);
INSERT INTO public.transactions VALUES ('40fccfaa-b03a-4b6c-86a2-6013d51cd5c0', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -1990000, 'tiền lương tháng', '2026-02-26 23:12:40.955394+07', '2026-02-26 23:12:40.955394+07', NULL, NULL, NULL, 0, 1990000);
INSERT INTO public.transactions VALUES ('dd2b38f9-4714-4f49-a55f-464a8b811bfc', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, 9999999, 'tiền mẹ cho', '2026-03-01 02:33:36.756592+07', '2026-03-01 02:33:36.756639+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('8b84281e-ae47-4f94-ac8d-60c266420d69', '18f0850b-aab4-4d66-a822-b5024697a43b', '2632ff62-5499-48ed-a06e-2f08e1680669', 100000, '[repay] mới trả', '2026-03-02 07:48:59.898788+07', '2026-03-02 07:48:59.898789+07', 100000, 100000, 200000, 1, 100000);
INSERT INTO public.transactions VALUES ('b34afe29-c5cb-4fb1-b624-87c2c7bf77f9', '18f0850b-aab4-4d66-a822-b5024697a43b', '4a9d7413-b749-4441-b823-9562a601368b', -2300000, 'party', '2026-03-01 02:34:33.822864+07', '2026-03-01 02:34:33.822865+07', 1000000, 1000000, 0, 0, 2300000);
INSERT INTO public.transactions VALUES ('b55f234f-fee1-4fb3-bdee-63e71322201f', '18f0850b-aab4-4d66-a822-b5024697a43b', '4a9d7413-b749-4441-b823-9562a601368b', 0, 'Hẹn với cái họ', '2026-03-01 14:16:21.996857+07', '2026-03-01 14:16:21.996908+07', 1000000, 0, 1000000, 1, 2300000);
INSERT INTO public.transactions VALUES ('110404ae-0fb1-4c9d-bd8a-85ad0157a9bb', '18f0850b-aab4-4d66-a822-b5024697a43b', '4a9d7413-b749-4441-b823-9562a601368b', 0, 'pảty', '2026-03-02 01:52:16.273569+07', '2026-03-02 01:52:16.273569+07', 1000000, -1000000, 0, 1, 2300000);
INSERT INTO public.transactions VALUES ('92c2e7fc-a9fe-4848-b139-6cec73d4005f', 'e0e860c5-6af2-459e-915a-f9a9159caa9c', NULL, 1000000, 'Ăn xin', '2026-03-02 02:09:24.141818+07', '2026-03-02 02:09:24.141818+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('90520e55-5eff-409f-851d-2be15fec2592', 'e0e860c5-6af2-459e-915a-f9a9159caa9c', '4a9d7413-b749-4441-b823-9562a601368b', -500000, 'Trả đó dcm tốn tiền vl', '2026-03-02 02:10:46.574338+07', '2026-03-02 02:10:46.574338+07', 500000, -500000, -1000000, 0, 500000);
INSERT INTO public.transactions VALUES ('a64c5882-fcf0-4cb8-bb05-1aff86b01092', 'e0e860c5-6af2-459e-915a-f9a9159caa9c', '4a9d7413-b749-4441-b823-9562a601368b', -500000, '[repay] má tốn tiền đi ăn vl', '2026-03-02 02:24:19.296832+07', '2026-03-02 02:24:19.296832+07', 500000, 0, -500000, 0, 500000);
INSERT INTO public.transactions VALUES ('e0240727-40ea-49b3-91a7-52819392a9ab', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -2300000, 'Hẹn với cái nịt', '2026-03-02 04:20:25.957058+07', '2026-03-02 04:20:25.957105+07', NULL, NULL, NULL, 0, 2300000);
INSERT INTO public.transactions VALUES ('31b64f74-5def-4f2e-a85c-260f648f1253', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -2300000, 'Hẹn với cái nịt 2', '2026-03-02 04:21:01.970245+07', '2026-03-02 04:21:01.970245+07', NULL, NULL, NULL, 0, 2300000);
INSERT INTO public.transactions VALUES ('d5f815c0-2e30-4ad8-b311-86275c47acdb', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -1000000, 'ok', '2026-03-02 04:24:35.610136+07', '2026-03-02 04:24:35.610136+07', NULL, NULL, NULL, 0, 1000000);
INSERT INTO public.transactions VALUES ('5d62fbab-702e-4f24-a790-67fc4bd9a991', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, 10000000, 'má cho tiền', '2026-03-02 04:28:32.476075+07', '2026-03-02 04:28:32.476076+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('a8bea722-1f0a-441f-b3c8-eb38101de0ac', '18f0850b-aab4-4d66-a822-b5024697a43b', '2632ff62-5499-48ed-a06e-2f08e1680669', -1000000, 'ok', '2026-03-02 04:28:52.715172+07', '2026-03-02 04:28:52.715172+07', NULL, 0, 0, 0, 1000000);
INSERT INTO public.transactions VALUES ('ea2e414f-f8d5-4c1f-9cf9-f1d1d5a83b88', '18f0850b-aab4-4d66-a822-b5024697a43b', '2632ff62-5499-48ed-a06e-2f08e1680669', -1000000, NULL, '2026-03-02 04:59:38.072771+07', '2026-03-02 04:59:38.072814+07', NULL, 0, 0, 0, 1000000);
INSERT INTO public.transactions VALUES ('93e26dc5-a085-458c-b98f-c4dfaa7695e7', '18f0850b-aab4-4d66-a822-b5024697a43b', '2632ff62-5499-48ed-a06e-2f08e1680669', -1000000, 'oh hell', '2026-03-02 05:00:05.017953+07', '2026-03-02 05:00:05.017953+07', 200000, 200000, 0, 0, 1000000);
INSERT INTO public.transactions VALUES ('e31a0705-63b2-428f-917b-76f899754f91', '18f0850b-aab4-4d66-a822-b5024697a43b', '2632ff62-5499-48ed-a06e-2f08e1680669', 0, '[repay] đã trả', '2026-03-02 05:00:49.132882+07', '2026-03-02 05:00:49.132882+07', 200000, 0, 200000, 1, 200000);
INSERT INTO public.transactions VALUES ('252ac7b8-770e-48b3-8e2f-6753e641cbbb', '18f0850b-aab4-4d66-a822-b5024697a43b', '2632ff62-5499-48ed-a06e-2f08e1680669', -1000000, 'ok', '2026-03-02 05:03:44.446608+07', '2026-03-02 05:03:44.446608+07', 200000, 200000, 0, 0, 1000000);
INSERT INTO public.transactions VALUES ('f5259de3-8ebb-41b2-8478-42cbecbb665f', '18f0850b-aab4-4d66-a822-b5024697a43b', '2632ff62-5499-48ed-a06e-2f08e1680669', 0, '[repay] ok tốt', '2026-03-02 05:04:30.722037+07', '2026-03-02 05:04:30.722037+07', 200000, 0, 200000, 1, 200000);
INSERT INTO public.transactions VALUES ('4739ed01-128c-46d9-9304-32a975769a85', '18f0850b-aab4-4d66-a822-b5024697a43b', '2632ff62-5499-48ed-a06e-2f08e1680669', -1000000, 'hẹn chị gay', '2026-03-02 05:09:43.229618+07', '2026-03-02 05:09:43.229665+07', 400000, 400000, 0, 0, 1000000);
INSERT INTO public.transactions VALUES ('49004b14-d447-4245-b21d-08ab8e2a22e4', '18f0850b-aab4-4d66-a822-b5024697a43b', '2632ff62-5499-48ed-a06e-2f08e1680669', 400000, '[repay] bú', '2026-03-02 05:18:14.494869+07', '2026-03-02 05:18:14.494869+07', 400000, 0, 400000, 1, 400000);
INSERT INTO public.transactions VALUES ('6c14a533-9c0a-4ae0-82dd-d5977d32c0d0', '18f0850b-aab4-4d66-a822-b5024697a43b', '2632ff62-5499-48ed-a06e-2f08e1680669', 0, 'đồ a hihi', '2026-03-02 07:50:11.111177+07', '2026-03-02 07:50:11.111177+07', 400000, -300000, 100000, 1, 1000000);
INSERT INTO public.transactions VALUES ('3cedfef5-1211-46d3-9375-eae0c419397f', '18f0850b-aab4-4d66-a822-b5024697a43b', '2632ff62-5499-48ed-a06e-2f08e1680669', -300000, '[repay] Đau ví', '2026-03-02 07:58:58.206625+07', '2026-03-02 07:58:58.206626+07', 300000, 0, -300000, 0, 300000);
INSERT INTO public.transactions VALUES ('b2c58cc5-9746-49d4-a3e4-51a52ceceda5', 'e0e860c5-6af2-459e-915a-f9a9159caa9c', NULL, 1000000, 'Transfer from Ăn ngoài', '2026-03-02 08:05:53.550372+07', '2026-03-02 08:05:53.550721+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('e0f7642e-d4ca-43e3-b1c2-b95d38244906', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -1000000, 'Transfer to hihihi', '2026-03-02 08:05:53.550372+07', '2026-03-02 08:05:53.550718+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('693be77e-036b-48df-acde-c7ddc8e27b09', '18f0850b-aab4-4d66-a822-b5024697a43b', '2632ff62-5499-48ed-a06e-2f08e1680669', 200000, '[repay] YES', '2026-03-02 05:19:45.928155+07', '2026-03-02 05:19:45.928155+07', 200000, 0, 200000, 1, 200000);
INSERT INTO public.transactions VALUES ('ceaa2415-00af-4b79-9388-a33025cd569f', 'e0e860c5-6af2-459e-915a-f9a9159caa9c', NULL, 1111111, 'Transfer from Ăn ngoài: abcadwedfd', '2026-03-02 08:17:36.501795+07', '2026-03-02 08:17:36.503094+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('e754295d-8b76-4e7c-afbc-d3987ae4fa3a', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -1111111, 'Transfer to hihihi: abcadwedfd', '2026-03-02 08:17:36.501795+07', '2026-03-02 08:17:36.502627+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('6dca1f86-c44b-490b-9448-204a4941ea76', '18f0850b-aab4-4d66-a822-b5024697a43b', '2632ff62-5499-48ed-a06e-2f08e1680669', -1000000, 'hẹn với air key vui vẻ yesssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', '2026-03-02 05:18:00+07', '2026-03-02 05:18:42.48907+07', 200000, 200000, 0, 0, 1000000);
INSERT INTO public.transactions VALUES ('67ec659e-00c2-4d36-baf5-0836082b5620', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -11111, 'Transfer to wallet 9e18c727-e81c-4ce2-8d35-8f76e347bc1d', '2025-09-24 12:29:46.83+07', '2026-02-24 12:29:46.830622+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('69334513-9a6f-48b5-a5a5-7646b597386b', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, 99999999, 'hii', '2026-03-02 07:30:35.296467+07', '2026-03-02 07:30:35.296532+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('74556054-79b3-4f7d-864c-f24832d4cffb', '18f0850b-aab4-4d66-a822-b5024697a43b', NULL, -99999999, 'hiiiiiiiiiii', '2026-03-02 07:30:58.765513+07', '2026-03-02 07:30:58.765513+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('28d8e5ef-67e4-410f-a881-0c973e3d57bb', '18f0850b-aab4-4d66-a822-b5024697a43b', '2632ff62-5499-48ed-a06e-2f08e1680669', -100000, 'ahihi', '2026-03-02 09:21:19.38374+07', '2026-03-02 09:21:19.38374+07', 90000, 90000, 0, 0, 100000);
INSERT INTO public.transactions VALUES ('b34d9ea4-461c-407c-9153-9cbe93968da9', '5413dae6-902a-477a-8d37-712f771f0f9e', NULL, 100000, 'init money', '2026-03-23 09:04:54.881052+07', '2026-03-23 09:04:54.881113+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('8c2056d5-7eac-434e-a32c-38ccb4eefec8', 'cdd1585a-110d-4f1f-b7cf-1def98a0f76b', NULL, 7000000, 'init money', '2026-03-23 09:05:09.771377+07', '2026-03-23 09:05:09.771377+07', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.transactions VALUES ('23cda5de-8242-4ba6-931b-f87a887664a8', 'cdd1585a-110d-4f1f-b7cf-1def98a0f76b', '0ef00445-c049-4616-9413-e61366d6f0ad', 50000, '[repay] cảm ơn', '2026-03-23 09:43:19.000366+07', '2026-03-23 09:43:19.000367+07', 50000, 150000, 200000, 1, 50000);
INSERT INTO public.transactions VALUES ('302faf25-28b2-4f51-a82b-09a86acb5b94', '5413dae6-902a-477a-8d37-712f771f0f9e', '0ef00445-c049-4616-9413-e61366d6f0ad', -200000, NULL, '2026-03-23 09:57:01.036239+07', '2026-03-23 09:57:01.036239+07', 55000, 205000, 150000, 0, 200000);


--
-- TOC entry 5056 (class 0 OID 77324)
-- Dependencies: 224
-- Data for Name: transfers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.transfers VALUES ('946e046f-93e1-4c73-ab68-33f425fc8fc1', '18f0850b-aab4-4d66-a822-b5024697a43b', 'b6c0d072-f094-46eb-b214-8183f2e669a2', 20000, '2026-02-24 00:51:59.237929+07', '2026-02-24 00:51:59.238084+07', '56f38e8d-4a71-4043-8084-a3fbdfb6e641', 'b1ce5731-1df5-4f1b-ba50-d030ba9e6b8f', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('53828045-f966-47cb-a682-895c2c296edb', '18f0850b-aab4-4d66-a822-b5024697a43b', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', 10000, '2026-02-24 04:02:52.487992+07', '2026-02-24 04:02:52.488221+07', 'd161119b-54e6-4b47-b0fa-c86107969981', '6c1af939-1c74-4a05-b421-1796306e62b3', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('14a8acb8-f431-423e-af2b-5acad88d7407', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', '18f0850b-aab4-4d66-a822-b5024697a43b', 10000, '2026-02-24 04:04:24.772634+07', '2026-02-24 04:04:24.77264+07', '1bdde552-3035-4481-8eb0-5de4673f8c8f', '4e26fba1-d442-47f2-9a73-c9d24a332ac1', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('cf6b49ed-e085-4bf4-a253-9e04ca793911', '18f0850b-aab4-4d66-a822-b5024697a43b', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', 20000, '2026-02-24 04:04:45.113627+07', '2026-02-24 04:04:45.11363+07', 'b7f798e2-1e3c-4f1c-ae26-c4874c082474', '30a21c24-a437-4c8e-96c5-b7c5beb57ad5', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('05bf397e-fbbc-4bdf-b855-d845865a847e', '18f0850b-aab4-4d66-a822-b5024697a43b', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', 10000, '2026-02-24 04:19:18.277371+07', '2026-02-24 04:19:18.277376+07', 'af24e3d1-344b-4b8c-b074-61f203ceee35', '6a3a95ef-7206-46ae-9564-61af2752c95f', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('0d7397f1-a2c0-4dff-a7ce-99be13280749', '18f0850b-aab4-4d66-a822-b5024697a43b', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', 10000, '2026-02-24 04:19:35.055725+07', '2026-02-24 04:19:35.055728+07', '09b82f2b-d362-4b1d-9d0a-f675a42e762d', 'b1edb1f1-cb35-442c-9aa0-db55acc8ae41', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('412479ec-04a4-45f6-b642-e477573c685c', '18f0850b-aab4-4d66-a822-b5024697a43b', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', 20000, '2026-02-24 04:30:31.749288+07', '2026-02-24 04:30:31.749294+07', '593953f0-aaaf-4b2c-a920-bc4a0f81bac8', '15dc119c-3d32-452a-80c5-66bb042eafb4', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('61cf64ef-37f8-4cd4-9241-7b32161754ee', '18f0850b-aab4-4d66-a822-b5024697a43b', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', 20000, '2026-02-24 04:30:40.535255+07', '2026-02-24 04:30:40.535259+07', 'a996af65-2680-471c-94b5-793067611979', '4095c7d7-bbdc-42ac-9dde-3eeb785c8ec1', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('2300eace-b2d3-4496-9f35-ecd0934b7b45', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', '18f0850b-aab4-4d66-a822-b5024697a43b', 80000, '2026-02-24 04:30:52.891706+07', '2026-02-24 04:30:52.891713+07', 'c3a1b1de-4ef6-4945-bb43-a9de0a987074', 'd4e15205-8e55-4011-b410-bea8e4be2cf2', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('dd852bc7-5d02-47e6-921b-4ed612750a9c', '18f0850b-aab4-4d66-a822-b5024697a43b', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', 22222, '2026-02-24 04:37:58.242717+07', '2026-02-24 04:37:58.24272+07', '72df8a06-daae-4c8e-9bee-e60c1e9a8e17', '3f296559-5bb9-4c1a-b298-e93dbcd1f87e', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('7f23238c-c9b3-4ee3-8e1a-17389919ecc9', '18f0850b-aab4-4d66-a822-b5024697a43b', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', 22222, '2026-02-24 05:48:33.638958+07', '2026-02-24 05:48:33.639204+07', 'cab5801e-2199-4891-a485-a4070b2c2d7d', '8330bb39-e88d-422b-8c6a-72dab8e7637c', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('1fa906a1-60b1-47ee-a8e9-ce0eae493997', '18f0850b-aab4-4d66-a822-b5024697a43b', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', 11111, '2026-02-24 12:29:46.8302+07', '2026-02-24 12:29:46.830306+07', '96bf3235-5e68-4f99-8519-09da583c8ef9', '67ec659e-00c2-4d36-baf5-0836082b5620', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('bbc3e852-8cba-4604-a807-b44dccb70436', '18f0850b-aab4-4d66-a822-b5024697a43b', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', 11111, '2026-02-24 12:30:00.023086+07', '2026-02-24 12:30:00.02309+07', 'c5292dc0-049e-48e3-846d-5e8877e3f936', 'a3ca2d05-191d-4eaa-b117-9323ff021e72', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('b2265dec-9b70-46a4-b962-ea1ab4ec7d47', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', '18f0850b-aab4-4d66-a822-b5024697a43b', 1234, '2026-02-26 11:15:45.40042+07', '2026-02-26 11:15:45.400549+07', '0dc62cde-1eed-4b20-a8e4-cf9dfce8128b', 'ffd76173-751d-4bb9-bbe6-163bc808b7b7', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('f9b7237a-890c-4675-b389-7697519707e9', '18f0850b-aab4-4d66-a822-b5024697a43b', 'e0e860c5-6af2-459e-915a-f9a9159caa9c', 70000, '2026-02-26 11:18:11.148552+07', '2026-02-26 11:18:11.148556+07', '8bb2dbff-403e-4ea9-a88c-0afe6acb938b', '2e5e709f-e7a0-4254-8c9c-0d533c2db77c', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('7b5b48cc-a037-4691-9fe1-9c138717a5d8', '18f0850b-aab4-4d66-a822-b5024697a43b', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', 10000, '2026-02-26 11:23:53.660144+07', '2026-02-26 11:23:53.660305+07', 'a05f0fed-db48-43b2-b106-e7c146917420', '80ab3ed0-6cbf-483a-bda7-7ac2b3bc3f93', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('3f481de5-3d84-44f3-9757-e3c239e87f32', '18f0850b-aab4-4d66-a822-b5024697a43b', '9e18c727-e81c-4ce2-8d35-8f76e347bc1d', 10000, '2026-02-26 11:28:05.938506+07', '2026-02-26 11:28:05.938509+07', '3f20c176-681e-4249-b0cb-87ef84e12676', 'e80bb702-9bcf-42df-9825-71677cc4efac', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('23516f42-1be7-4231-9cb2-11268ed4727a', '18f0850b-aab4-4d66-a822-b5024697a43b', 'b6c0d072-f094-46eb-b214-8183f2e669a2', 10000, '2026-02-26 11:29:19.760361+07', '2026-02-26 11:29:19.760519+07', '92dfc294-f9c5-47aa-b538-515846a99fe9', 'adbe49c5-38d0-4c0d-b5e4-63b77ed9bf27', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('0688b802-04f4-48ff-b5b0-654116ec6ead', '18f0850b-aab4-4d66-a822-b5024697a43b', 'e0e860c5-6af2-459e-915a-f9a9159caa9c', 1000000, '2026-03-02 08:05:53.550372+07', '2026-03-02 08:05:53.550488+07', 'b2c58cc5-9746-49d4-a3e4-51a52ceceda5', 'e0f7642e-d4ca-43e3-b1c2-b95d38244906', '5a91eff9-f362-4c75-a9c6-01c870a54f15');
INSERT INTO public.transfers VALUES ('b0fca91f-ac15-4b75-9875-c349f9b1396b', '18f0850b-aab4-4d66-a822-b5024697a43b', 'e0e860c5-6af2-459e-915a-f9a9159caa9c', 1111111, '2026-03-02 08:17:36.501795+07', '2026-03-02 08:17:36.501971+07', 'ceaa2415-00af-4b79-9388-a33025cd569f', 'e754295d-8b76-4e7c-afbc-d3987ae4fa3a', '5a91eff9-f362-4c75-a9c6-01c870a54f15');


--
-- TOC entry 5052 (class 0 OID 77251)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES ('eb78f0f6-fcd1-477a-b134-20edaf779763', 'hibro', '$2a$12$ibur7Gl3XdKff4eiD7yavOSuqMNH7CS/.d9s4CGqTF/yQrRSOAm9a', 'ohno', 'abc@gmail', NULL, NULL, '2026-02-15 02:30:02.219492+07');
INSERT INTO public.users VALUES ('5a91eff9-f362-4c75-a9c6-01c870a54f15', 'gay', '$2a$12$pkYW5D0ZuJXq5VCtCM.fb.QSchdF8WDE25xcxahrNi5cWWjgZjfnC', 'anc', NULL, '18f0850b-aab4-4d66-a822-b5024697a43b', '2632ff62-5499-48ed-a06e-2f08e1680669', '2026-02-15 11:44:54.153907+07');
INSERT INTO public.users VALUES ('c5d9877a-5904-4be1-ab9d-871ab0c25f63', 'Grab', '$2a$12$W0CsMaj1jMvzNdbZI1jBbeGIGjlXo/u5P3AL7dJMoqopp.nPTSIum', 'hihi', NULL, '5413dae6-902a-477a-8d37-712f771f0f9e', '0ef00445-c049-4616-9413-e61366d6f0ad', '2026-03-23 08:57:14.862176+07');


--
-- TOC entry 5054 (class 0 OID 77281)
-- Dependencies: 222
-- Data for Name: wallets; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.wallets VALUES ('6aad7d21-f660-4cf9-811e-8c077cc66c1b', 'eb78f0f6-fcd1-477a-b134-20edaf779763', NULL, 'No', 'it''s good', '2026-02-15 02:30:27.91319+07');
INSERT INTO public.wallets VALUES ('306feac1-bf8a-4790-8975-f1560d953eb3', 'eb78f0f6-fcd1-477a-b134-20edaf779763', NULL, 'oh', NULL, '2026-02-15 02:33:54.969745+07');
INSERT INTO public.wallets VALUES ('d827f649-230c-47df-9568-658bf4a5ef0e', 'eb78f0f6-fcd1-477a-b134-20edaf779763', NULL, 'tui la cha', NULL, '2026-02-15 02:37:35.326351+07');
INSERT INTO public.wallets VALUES ('4f5bea32-65a4-49a0-9995-608e932a5f80', 'eb78f0f6-fcd1-477a-b134-20edaf779763', NULL, 'oh', NULL, '2026-02-15 02:37:42.545423+07');
INSERT INTO public.wallets VALUES ('9c77fca1-5e10-4e96-a39a-156364c69c21', 'eb78f0f6-fcd1-477a-b134-20edaf779763', NULL, 'oh', NULL, '2026-02-15 02:37:43.36686+07');
INSERT INTO public.wallets VALUES ('ad2508fb-152f-4023-88a8-6146d31044b7', 'eb78f0f6-fcd1-477a-b134-20edaf779763', '9c77fca1-5e10-4e96-a39a-156364c69c21', 'oh', NULL, '2026-02-15 02:38:12.403429+07');
INSERT INTO public.wallets VALUES ('f6a1f720-6c4f-4804-a28d-cb176e054b63', 'eb78f0f6-fcd1-477a-b134-20edaf779763', NULL, 'No', 'it''s good', '2026-02-15 02:37:42.910542+07');
INSERT INTO public.wallets VALUES ('4511b398-c328-4c6c-86f3-8672a4dbccde', 'eb78f0f6-fcd1-477a-b134-20edaf779763', NULL, 'Ví túi', NULL, '2026-02-15 15:05:08.746712+07');
INSERT INTO public.wallets VALUES ('f55a251c-f362-4ae1-bb31-1d2a0966b3b3', '5a91eff9-f362-4c75-a9c6-01c870a54f15', 'b6c0d072-f094-46eb-b214-8183f2e669a2', 'AAAA', NULL, '2026-02-15 14:06:35.638643+07');
INSERT INTO public.wallets VALUES ('1bc12ad2-e65f-4c58-a344-6b1653d6311b', '5a91eff9-f362-4c75-a9c6-01c870a54f15', NULL, 'mybad', NULL, '2026-02-15 12:06:38.140876+07');
INSERT INTO public.wallets VALUES ('b6c0d072-f094-46eb-b214-8183f2e669a2', '5a91eff9-f362-4c75-a9c6-01c870a54f15', '1bc12ad2-e65f-4c58-a344-6b1653d6311b', 'hihi', NULL, '2026-02-15 12:06:20.233296+07');
INSERT INTO public.wallets VALUES ('295fe618-1a15-4b16-9d0e-a2351dc2af51', '5a91eff9-f362-4c75-a9c6-01c870a54f15', NULL, 'my túi lol', 'chuyên ăn vặt', '2026-02-16 15:53:12.963983+07');
INSERT INTO public.wallets VALUES ('e0e860c5-6af2-459e-915a-f9a9159caa9c', '5a91eff9-f362-4c75-a9c6-01c870a54f15', '295fe618-1a15-4b16-9d0e-a2351dc2af51', 'hihihi', NULL, '2026-02-21 14:26:21.437345+07');
INSERT INTO public.wallets VALUES ('9e18c727-e81c-4ce2-8d35-8f76e347bc1d', '5a91eff9-f362-4c75-a9c6-01c870a54f15', 'a7a93aba-6f5c-467c-b87d-0fa1fd62c46f', 'abcabc', 'abcabc', '2026-02-22 13:46:13.102861+07');
INSERT INTO public.wallets VALUES ('a7a93aba-6f5c-467c-b87d-0fa1fd62c46f', '5a91eff9-f362-4c75-a9c6-01c870a54f15', NULL, 'ahihih', 'aa', '2026-02-21 17:10:23.300533+07');
INSERT INTO public.wallets VALUES ('18f0850b-aab4-4d66-a822-b5024697a43b', '5a91eff9-f362-4c75-a9c6-01c870a54f15', '295fe618-1a15-4b16-9d0e-a2351dc2af51', 'Ăn ngoài', 'abc', '2026-02-23 09:16:15.437841+07');
INSERT INTO public.wallets VALUES ('6a38d768-eb75-4c62-95c9-227686b9ac8b', 'c5d9877a-5904-4be1-ab9d-871ab0c25f63', NULL, 'Ví là ví', 'ờ vậy đó', '2026-03-23 08:58:25.641736+07');
INSERT INTO public.wallets VALUES ('5413dae6-902a-477a-8d37-712f771f0f9e', 'c5d9877a-5904-4be1-ab9d-871ab0c25f63', '6a38d768-eb75-4c62-95c9-227686b9ac8b', 'túi', NULL, '2026-03-23 08:58:44.100654+07');
INSERT INTO public.wallets VALUES ('cdd1585a-110d-4f1f-b7cf-1def98a0f76b', 'c5d9877a-5904-4be1-ab9d-871ab0c25f63', '6a38d768-eb75-4c62-95c9-227686b9ac8b', 'bank', NULL, '2026-03-23 08:58:48.391644+07');


--
-- TOC entry 4877 (class 2606 OID 76849)
-- Name: __EFMigrationsHistory pk___ef_migrations_history; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT pk___ef_migrations_history PRIMARY KEY (migration_id);


--
-- TOC entry 4882 (class 2606 OID 77363)
-- Name: debt_partners pk_debt_partners; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.debt_partners
    ADD CONSTRAINT pk_debt_partners PRIMARY KEY (id);


--
-- TOC entry 4890 (class 2606 OID 77361)
-- Name: transactions pk_transactions; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT pk_transactions PRIMARY KEY (id);


--
-- TOC entry 4895 (class 2606 OID 77359)
-- Name: transfers pk_transfers; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT pk_transfers PRIMARY KEY (id);


--
-- TOC entry 4879 (class 2606 OID 77357)
-- Name: users pk_users; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT pk_users PRIMARY KEY (id);


--
-- TOC entry 4886 (class 2606 OID 77355)
-- Name: wallets pk_wallets; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT pk_wallets PRIMARY KEY (id);


--
-- TOC entry 4880 (class 1259 OID 77347)
-- Name: ix_debt_partners_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_debt_partners_user_id ON public.debt_partners USING btree (user_id);


--
-- TOC entry 4887 (class 1259 OID 77348)
-- Name: ix_transactions_partner_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_transactions_partner_id ON public.transactions USING btree (partner_id);


--
-- TOC entry 4888 (class 1259 OID 77349)
-- Name: ix_transactions_wallet_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_transactions_wallet_id ON public.transactions USING btree (wallet_id);


--
-- TOC entry 4891 (class 1259 OID 77350)
-- Name: ix_transfers_from_wallet_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_transfers_from_wallet_id ON public.transfers USING btree (from_wallet_id);


--
-- TOC entry 4892 (class 1259 OID 77351)
-- Name: ix_transfers_to_wallet_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_transfers_to_wallet_id ON public.transfers USING btree (to_wallet_id);


--
-- TOC entry 4893 (class 1259 OID 77402)
-- Name: ix_transfers_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_transfers_user_id ON public.transfers USING btree (user_id);


--
-- TOC entry 4883 (class 1259 OID 77352)
-- Name: ix_wallets_parent_wallet_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_wallets_parent_wallet_id ON public.wallets USING btree (parent_wallet_id);


--
-- TOC entry 4884 (class 1259 OID 77353)
-- Name: ix_wallets_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_wallets_user_id ON public.wallets USING btree (user_id);


--
-- TOC entry 4896 (class 2606 OID 77364)
-- Name: debt_partners fk_debt_partners_users_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.debt_partners
    ADD CONSTRAINT fk_debt_partners_users_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4899 (class 2606 OID 77369)
-- Name: transactions fk_transactions_debt_partners_partner_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT fk_transactions_debt_partners_partner_id FOREIGN KEY (partner_id) REFERENCES public.debt_partners(id) ON DELETE SET NULL;


--
-- TOC entry 4900 (class 2606 OID 77374)
-- Name: transactions fk_transactions_wallets_wallet_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT fk_transactions_wallets_wallet_id FOREIGN KEY (wallet_id) REFERENCES public.wallets(id) ON DELETE CASCADE;


--
-- TOC entry 4901 (class 2606 OID 77403)
-- Name: transfers fk_transfers_users_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT fk_transfers_users_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4902 (class 2606 OID 77379)
-- Name: transfers fk_transfers_wallets_from_wallet_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT fk_transfers_wallets_from_wallet_id FOREIGN KEY (from_wallet_id) REFERENCES public.wallets(id) ON DELETE RESTRICT;


--
-- TOC entry 4903 (class 2606 OID 77384)
-- Name: transfers fk_transfers_wallets_to_wallet_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT fk_transfers_wallets_to_wallet_id FOREIGN KEY (to_wallet_id) REFERENCES public.wallets(id) ON DELETE RESTRICT;


--
-- TOC entry 4897 (class 2606 OID 77389)
-- Name: wallets fk_wallets_users_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT fk_wallets_users_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4898 (class 2606 OID 77394)
-- Name: wallets fk_wallets_wallets_parent_wallet_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT fk_wallets_wallets_parent_wallet_id FOREIGN KEY (parent_wallet_id) REFERENCES public.wallets(id) ON DELETE RESTRICT;


-- Completed on 2026-03-27 06:28:07

--
-- PostgreSQL database dump complete
--

\unrestrict scqqXzaAb5L9RZxX3Xwj9TCHs8K6bH31AZdHzXOnOJoyr0iOmUifhz8Qb3edbAN

