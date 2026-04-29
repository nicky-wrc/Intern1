function findServiceIdByName(name) {
    const target = String(name || '').trim().toLowerCase();
    if (!target || !serviceDataCache) return '';

    for (const cat in serviceDataCache) {
        if (!Object.prototype.hasOwnProperty.call(serviceDataCache, cat)) continue;
        const list = serviceDataCache[cat];
        if (!Array.isArray(list)) continue;

        for (const s of list) {
            const nm = String(s?.name || '').trim().toLowerCase();
            if (nm === target) return String(s.id || '');
        }
    }
    return '';
}

function cleanText(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/\\'/g, "'").replace(/\\"/g, '"');
}

let itemNumber = 1;
let groupCounter = 0;
let serviceDataCache = null;
let draggedRow = null;
let serviceDataReady = false;
const custom_desc = {
    'SEM/SMM': `SEM/SMM หมายเหตุ
การเรียกเก็บเงิน:
1. การบริการ จะเริ่มต้นเมื่อลูกค้าได้ชำระค่าบริการแล้ว 100% 
2. ราคาตามระบุในใบเสนอราคาเป็นเพียงค่าบริการรายเดือนเท่านั้น ไม่รวมค่าโฆษณา
3. เรามีวันที่รอบการเรียกเก็บเงินมาตรฐานสองวันสำหรับแคมเปญทั้งหมด - วันที่ 1 หรือ 15 ของแต่ละเดือน ขึ้นอยู่กับวันที่ทำการชำระเงินครั้งที่หนึ่งและการตั้งค่าของคุณแคมเปญของคุณจะถูกส่งไปยังรอบการเรียกเก็บเงินต่อไป
การยกเลิก:
1. จะต้องแจ้งล่วงหน้า 30 วันเพื่อยกเลิกแคมเปญใดๆ ที่ดำเนินการอยู่`,
    'SEO': `SEO หมายเหตุ
การเรียกเก็บเงิน:
1. การบริการ จะเริ่มต้นเมื่อลูกค้าได้ชำระค่าบริการแล้ว
2. เรามีวันที่รอบการเรียกเก็บเงินมาตรฐานสองวันสำหรับแคมเปญทั้งหมด - วันที่ 1 หรือ 15 ของแต่ละเดือนขึ้นอยู่กับวันที่ทำการชำระเงินครั้งที่หนึ่งและการตั้งค่าของคุณแคมเปญของคุณจะถูกส่งไปยังรอบการเรียกเก็บเงินต่อไป
การยกเลิก:
1. จะต้องแจ้งล่วงหน้า 30 วันเพื่อยกเลิกแคมเปญใดๆ ที่ดำเนินการอยู่`,
    'WEBSITE': `WEBSITE หมายเหตุ เนื้อหาแก้ตามตกลงกับลูกค้า
1. การออกแบบ และจัดทำเว็บไซต์
1.1. การแก้ไขทำได้ไม่เกินจำนวน 3 ครั้งหลังจากผู้ให้บริการและผู้ใช้บริการรับทราบรายละเอียดการประเมินงานในครั้งแรกที่ตกลงกันไว้
1.2. ไฟล์ใดๆ ที่เป็นของผู้ใช้บริการ และส่งมาให้ผู้ให้บริการเพื่อลงในเว็บไซต์ จะต้องเป็นข้อมูลลิขสิทธิ์ถูกต้องของผู้ใช้บริการเท่านั้น
1.3. ทุกเว็บไซต์ ขณะที่ออกแบบอยู่ภายใต้ subdomain ของผู้ให้บริการ และเมื่อทำการถ่ายโอนข้อมูลลงในเว็บโฮสติ้งของผู้ใช้บริการเมื่อส่งมอบงานแล้วถือว่าเป็นการเสร็จสิ้นการออกแบบเว็บไซต์
2. ระยะเวลาในการออกแบบเว็บไซต์
2.1. ระยะเวลาในการออกแบบเว็บไซต์ใช้ระยะเวลาทั้งหมดรวมกัน ไม่เกิน 45-60 วัน (ขึ้นอยู่กับการส่งข้อมูลของผู้ใช้บริการ)
3. การส่งมอบงาน และการบริการหลังการมอบงาน
3.1. หลังจากวันส่งมอบงานแล้วสามารถแก้ไขหรือเปลี่ยนแปลง โดยไม่มีค่าใช้จ่ายเพิ่มเติมเป็นระยะเวลา 15 วัน โดยต้องเป็นส่วนที่มีปัญหาด้านเทคนิคหรือระบบขัดข้องที่ไม่ได้เกิดจากการปรับแต่งของผู้ใช้บริการเอง หากเกิน 15 วัน หลังจากส่งมอบงานแล้วต้องการแก้ไขหรือเปลี่ยนแปลง ผู้ให้บริการมีสิทธิ์คิดค่าบริการเพิ่มเติม
3.2. ผู้ให้บริการดูแลรับผิดชอบความเรียบร้อยของเว็บไซต์หากเว็บไซต์เกิดชำรุด บกพร่องให้หลังวันส่งมอบงาน ในระยะเวลา 60 วัน โดยเป็นส่วนที่เกี่ยวกับความรับผิดชอบหรือส่วนที่ทางผู้ให้บริการเป็นผู้กระทำ ทางผู้ให้บริการจะการแก้ไขให้โดยไม่มีค่าใช้จ่าย แต่หากเกิดชำรุด บกพร่องหรือข้อผิดพลาดหลังจากครบวันกำหนดดังกล่าว ถือว่าไม่ได้อยู่ในความรับผิดชอบของทางผู้ให้บริการ
4. เงื่อนไขการชำระเงิน
4.1 การบริการ จะเริ่มต้นเมื่อลูกค้าได้ชำระค่าบริการแล้ว 100%

*ราคานี้ไม่รวมค่าใช้จ่ายเกี่ยวกับ Hosting และ Domain*` ,
    'Backlink': `Backlink ราย 3 เดือน หมายเหตุ
การเรียกเก็บเงิน:
1. การบริการ จะเริ่มต้นเมื่อลูกค้าได้ชำระค่าบริการแล้ว 100% 
2. การบริการสำหรับ Backlink รายเดือน สัญญาขั้นต่ำ 3 เดือน
3. เรามีวันที่รอบการเรียกเก็บเงินมาตรฐานสองวันสำหรับแคมเปญทั้งหมด - วันที่ 1 หรือ 15 ของแต่ละเดือน ขึ้นอยู่กับวันที่ทำการชำระเงินครั้งที่หนึ่งและการตั้งค่าของคุณแคมเปญของคุณจะถูกส่งไปยังรอบการเรียกเก็บเงินต่อไป
การยกเลิก:
1. จะต้องแจ้งล่วงหน้า 30 วันเพื่อยกเลิกแคมเปญใดๆ ที่ดำเนินการอยู่` ,
    'AEO': `AEO หมายเหตุ
 	- การทำ AEO เป็นการต่อยอดจาก SEO ไม่สามารถทำ AEO ได้หากเว็บไซต์ยังไม่ได้ทำ SEO
- การวัดผล ณ ปัจจุบันจะทำได้ค่อนข้างยาก เนื่องด้วยยังไม่มีเครื่องมือที่สามารถรายงาน AEO Results ได้อย่างชัดเจน อีกทั้ง Prompt ที่ใช้ค้นหา และ History ของแต่ละ User ก็มีความแตกต่างกัน
- แนวทางการทำ AEO อาจจะต้องมีการทำ Outreach เพิ่มเพื่อให้ติด AEO ดีขึ้น (หากลูกค้าอยากทำ ourtreach เพิ่มจะมีค่าใช้จ่ายเพิ่มเติม)
การเรียกเก็บเงิน:
1. การบริการ จะเริ่มต้นเมื่อลูกค้าได้ชำระค่าบริการแล้ว
2. เรามีวันที่รอบการเรียกเก็บเงินมาตรฐานสองวันสำหรับแคมเปญทั้งหมด - วันที่ 1 หรือ 15 ของแต่ละเดือนขึ้นอยู่กับวันที่ทำการชำระเงินครั้งที่หนึ่งและการตั้งค่าของคุณแคมเปญของคุณจะถูกส่งไปยังรอบการเรียกเก็บเงินต่อไป
การยกเลิก:
1. จะต้องแจ้งล่วงหน้า 30 วันเพื่อยกเลิกแคมเปญใดๆ ที่ดำเนินการอยู่`
}

// track which custom descriptions have already been appended to avoid duplicates
// Map to track appended services/custom descriptions grouped by category
// key: category name -> value: Set of keys already appended (service names and custom keys)
// Map to track appended remarks grouped by category with reference counts
// currentRemarksByCategory: Map<category, Map<key, count>>
let currentRemarksByCategory = new Map();

// Map groupId -> Set of strings "category||key" that were added by that group
let groupRemarksMap = new Map();

document.getElementById('price_quotation_form').addEventListener('keypress', function (event) {
    if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault();
    }
});

// ============================================

// Top-level Add Item removed in favour of per-group Add buttons.

function toggleDetails(element) {
    var details = element.nextElementSibling;
    if (details.style.display === "none") {
        details.style.display = "block";
    } else {
        details.style.display = "none";
    }
}
// Include All is handled per-service-group (dynamically created buttons)
// // Function to update item numbers after deleting rows
function normalizeNewlines(str) {
    str = String(str ?? '');

    // handle escaped sequences
    str = str
        .replace(/\\r\\n/g, "\n")
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\n")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n");

    // fallback: ถ้ายังมี rn และไม่มี newline เลย -> แปลง rn เป็น newline
    if (str.includes('rn') && !str.includes('\n')) {
        str = str.replace(/rn/g, "\n");
    }

    return str;
}

async function importPreviousQuote(details) {
    // populate header fields (safe access)
    const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v ?? ''; };
    setVal('company_name', details.company_name);
    setVal('full_name', details.full_name);
    setVal('company_address', details.company_address);
    setVal('company_email', details.company_email);
    setVal('company_phone', details.company_phone);
    setVal('customer_tax_id', details.customer_tax_id);
    setVal('client_address', details.client_address);
    setVal('client_email', details.client_email);
    setVal('client_phone', details.client_phone);
    setVal('client_name', details.client_name);
    setVal('quotation_date', details.quotation_date);
    setVal('quotation_valid_date', details.quotation_valid_date);
    // NOTE: Don't set remark here - it will be rebuilt from service groups
    setVal('project_desc', details.project_desc);
    setVal('vat_percentage', details.vat_percentage);
    setVal('discount_type', details.discount_type);
    setVal('discount', details.discount);
    setVal('running_number', details.running_number);
    setVal('revised_quotation', details.revised_quotation);

    updateMonthlyPrice(details);

    const selectedRadio = document.querySelector(`input[name="currency"][value="${details.currency}"]`);
    if (selectedRadio) selectedRadio.checked = true;

    // Clear existing groups and reset counters/maps
    const container = document.getElementById('service_groups_container');
    if (container) container.innerHTML = '';
    itemNumber = 1;
    groupCounter = 0;
    try { currentRemarksByCategory.clear(); } catch (e) { }
    try { groupRemarksMap.clear(); } catch (e) { }

    // Clear remarks textarea so it will be rebuilt from service groups
    const remarksField = document.getElementById('remark');
    if (remarksField) remarksField.value = '';

    // If there are no items, finish
    if (!details.items || !Array.isArray(details.items) || details.items.length === 0) {
        updateTotalAmount();
        const popup = document.getElementById('history_popup'); if (popup) popup.style.display = 'none';
        document.body.style.overflow = 'auto';
        return;
    }

    // Group items by group_id
    const grouped = {};
    for (const it of details.items) {
        const gid = (it.group_id && String(it.group_id).trim() !== '') ? String(it.group_id) : 'ungrouped';
        if (!grouped[gid]) grouped[gid] = [];
        grouped[gid].push(it);
    }

    // For each saved group create UI group and import rows
    for (const origGid of Object.keys(grouped)) {
        const items = grouped[origGid];

        // สร้าง service group ใหม่
        const newGroupId = createServiceGroup();
        const tbody = document.getElementById(`services_table_body_${newGroupId}`);
        const displayInput = document.getElementById(`service_display_name_${newGroupId}`);

        // ✅ import rename (ถ้ามี) และปักธงว่าผู้ใช้เคยแก้เอง
        if (displayInput) {
            const renamed =
                details.service_display_name?.[origGid] ??
                details.service_display_name?.[String(origGid)] ??
                details.service_display_name?.[parseInt(origGid, 10)];

            if (renamed && String(renamed).trim()) {
                displayInput.value = String(renamed);
                displayInput.dataset.userEdited = '1';
            }
        }


        if (!tbody) {
            console.warn('Missing tbody for group', newGroupId);
            continue;
        }

        // -----------------------------
        // 1) หา "ชื่อ service" ให้ได้ก่อน (เอาไว้ใช้ทั้ง dropdown และ display name)
        // -----------------------------
        let serviceName = '';

        // ลองหาจาก service_group_name ก่อน
        if (details.service_group_name && details.service_group_name[origGid]) {
            serviceName = String(details.service_group_name[origGid]).trim();
        }

        // รองรับ key แบบ string/number เผื่อไม่ตรง
        if (!serviceName && details.service_group_name) {
            serviceName =
                String(details.service_group_name[String(origGid)] ?? '').trim() ||
                String(details.service_group_name[parseInt(origGid, 10)] ?? '').trim();
        }

        // ถ้ายังไม่เจอ ให้หาจาก items
        if (!serviceName) {
            for (const it of items) {
                if (it.service_name && String(it.service_name).trim() !== '') {
                    serviceName = String(it.service_name).trim();
                    break;
                }
            }
        }

        // -----------------------------
        // 2) ใส่ค่า "ช่อง rename" ให้เสมอ
        //    - ถ้ามี service_display_name (ของที่ user พิมพ์ rename) ใช้อันนั้นก่อน
        //    - ถ้าไม่มี ให้ fallback เป็น serviceName
        // -----------------------------
        if (displayInput) {
            const renamed =
                details.service_display_name?.[origGid] ??
                details.service_display_name?.[String(origGid)] ??
                details.service_display_name?.[parseInt(origGid, 10)];

            if (renamed) {
                const nice = findServiceNameById(renamed) || renamed;
                displayInput.value = nice;
            }

            if (!displayInput.value.trim() && serviceName) {
                displayInput.value = serviceName;
            }
        }

        // -----------------------------
        // 3) ตั้งค่า dropdown ให้เลือก service เดิม
        //    - ถ้ามี service_group_id ใช้เลย (ดีที่สุด)
        //    - ถ้าไม่มี id ให้หา id จากชื่อ (findServiceIdByName)
        // -----------------------------
        if (serviceName) {
            const dropdown = document.getElementById(`service_dropdown_${newGroupId}`);
            if (dropdown) {
                let serviceId =
                    details.service_group_id?.[origGid] ??
                    details.service_group_id?.[String(origGid)] ??
                    details.service_group_id?.[parseInt(origGid, 10)];

                const serviceLabel =
                    details.service_group_name?.[origGid] ??
                    details.service_group_name?.[String(origGid)] ??
                    details.service_group_name?.[parseInt(origGid, 10)] ??
                    serviceName;

                const waitAndSet = () => {
                    // รอจน services.json โหลดเสร็จ และ dropdown มี options
                    if (!serviceDataReady || !serviceDataCache || dropdown.options.length <= 1) {
                        setTimeout(waitAndSet, 100);
                        return;
                    }

                    if (!serviceId && serviceLabel) {
                        // 1) ถ้า label มันคือ id อยู่แล้ว -> ใช้เลยถ้ามีจริงใน cache
                        const idCandidate = String(serviceLabel).trim();
                        const nameCandidate = String(serviceLabel).trim();

                        // helper: หา id จาก id โดยตรง
                        const findServiceIdById = (id) => {
                            if (!id || !serviceDataCache) return '';
                            for (const cat in serviceDataCache) {
                                const list = serviceDataCache[cat];
                                if (!Array.isArray(list)) continue;
                                for (const s of list) {
                                    if (String(s?.id || '') === id) return id;
                                }
                            }
                            return '';
                        };

                        serviceId = findServiceIdById(idCandidate);

                        // 2) ถ้าไม่เจอค่อยหาแบบ name
                        if (!serviceId && typeof findServiceIdByName === 'function') {
                            serviceId = findServiceIdByName(nameCandidate);
                        }

                        // 3) fallback เพิ่ม: แปลง underscore -> space แล้วลองหา name อีกที
                        if (!serviceId && typeof findServiceIdByName === 'function') {
                            const spaced = nameCandidate.replace(/_/g, ' ');
                            serviceId = findServiceIdByName(spaced);
                        }
                    }


                    if (serviceId) {
                        dropdown.value = serviceId;
                        dropdown.dispatchEvent(new Event('change', { bubbles: true }));

                        const niceName =
                            findServiceNameById(serviceId) ||
                            (dropdown.options[dropdown.selectedIndex]?.text || '');

                        // ✅ ตั้งชื่อเฉพาะตอนที่ user ยังไม่ได้ rename
                        if (
                            displayInput &&
                            !displayInput.dataset.userEdited &&   // <-- สำคัญมาก
                            !displayInput.value.trim()
                        ) {
                            displayInput.value = niceName;
                        }
                    }
                    else {
                        console.warn('Service id not found for label:', serviceLabel, 'origGid:', origGid);
                    }
                };

                waitAndSet();
            }
        }

        // -----------------------------
        // 4) Import rows (parent/child) ตามเดิมของคุณ
        // -----------------------------
        const rowIdMap = {};

        // First pass: add parent rows (row_id without dot)
        for (const it of items) {
            const rowIdStr = String(it.row_id || '');
            const isChild = rowIdStr.indexOf('.') !== -1;

            if (!isChild) {
                addServiceRowToGroup(
                    newGroupId,
                    it.description ?? '',
                    it.quantity ?? 1,
                    it.price ?? 0,
                    it.include ?? 0
                );

                const parents = Array.from(tbody.querySelectorAll('tr[data-parent-id="null"]'));
                const created = parents[parents.length - 1];

                if (created) {
                    const newId = created.getAttribute('data-row-id');
                    rowIdMap[rowIdStr] = String(newId);

                    if (it.include == 1 || it.include === '1') {
                        const includeBtn = created.querySelector('.btn-primary');
                        if (includeBtn) includeSubServiceRow(includeBtn);
                    }
                }
            }
        }

        // Second pass: add child rows and map parent references
        for (const it of items) {
            const rowIdStr = String(it.row_id || '');
            const isChild = rowIdStr.indexOf('.') !== -1;

            if (isChild) {
                const parentOld = String(it.parent_id || '');
                const mappedParent = rowIdMap[parentOld];

                if (mappedParent) {
                    addSubServiceRow(null, mappedParent, it.description ?? '', it.quantity ?? 1, it.price ?? 0);
                } else {
                    addServiceRowToGroup(
                        newGroupId,
                        it.description ?? '',
                        it.quantity ?? 1,
                        it.price ?? 0,
                        it.include ?? 0
                    );
                }
            }
        }

        // ไม่ auto include-all (คงค่า include เดิมรายแถว)
    }

    // Backwards/legacy global include_all
    // Do not apply legacy/global include-all on import to avoid forcing visibility changes.
    // if (details.include_all == 1) includeAllServiceRow();

    updateTotalAmount();

    // Restore the full remarks from history (includes both service remarks and custom remarks)
    if (details.remark) {
        const remarksField = document.getElementById('remark');
        if (remarksField) {
            remarksField.value = normalizeNewlines(details.remark);
        }
    }

    const popup = document.getElementById('history_popup'); if (popup) popup.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function restoreServiceDropdown(details) {
    const selects = document.querySelectorAll('select.service-dropdown');

    // map group_id -> candidate name (fallback)
    const nameByGroup = {};
    if (details && Array.isArray(details.items)) {
        details.items.forEach(it => {
            const gid = (it.group_id ?? 'ungrouped').toString();
            if (!nameByGroup[gid] && it.service_name) nameByGroup[gid] = String(it.service_name);
        });
    }

    const apply = () => {
        selects.forEach(sel => {
            const gid = (sel.getAttribute('data-group-id') || 'ungrouped').toString();

            // 1) ใช้ id จาก history ก่อน (ดีที่สุด)
            let serviceId =
                details?.service_group_id?.[gid] ??
                details?.service_group_id?.[String(gid)] ??
                details?.service_group_id?.[parseInt(gid, 10)];

            // 2) ถ้าไม่มี id ให้พยายามหา id จากชื่อ (ใช้ service_group_name หรือ items)
            const serviceLabel =
                details?.service_group_name?.[gid] ??
                details?.service_group_name?.[String(gid)] ??
                details?.service_group_name?.[parseInt(gid, 10)] ??
                nameByGroup[gid] ??
                '';

            // รอจน dropdown มี options และ data พร้อม
            if (!serviceDataReady || !serviceDataCache || sel.options.length <= 1) return;

            if (!serviceId && serviceLabel) {
                // 1) ถ้า label มันคือ id อยู่แล้ว -> ใช้เลยถ้ามีจริงใน cache
                const idCandidate = String(serviceLabel).trim();
                const nameCandidate = String(serviceLabel).trim();

                // helper: หา id จาก id โดยตรง
                const findServiceIdById = (id) => {
                    if (!id || !serviceDataCache) return '';
                    for (const cat in serviceDataCache) {
                        const list = serviceDataCache[cat];
                        if (!Array.isArray(list)) continue;
                        for (const s of list) {
                            if (String(s?.id || '') === id) return id;
                        }
                    }
                    return '';
                };

                serviceId = findServiceIdById(idCandidate);

                // 2) ถ้าไม่เจอค่อยหาแบบ name
                if (!serviceId && typeof findServiceIdByName === 'function') {
                    serviceId = findServiceIdByName(nameCandidate);
                }

                // 3) fallback เพิ่ม: แปลง underscore -> space แล้วลองหา name อีกที
                if (!serviceId && typeof findServiceIdByName === 'function') {
                    const spaced = nameCandidate.replace(/_/g, ' ');
                    serviceId = findServiceIdByName(spaced);
                }
            }

            if (serviceId) {
                sel.value = serviceId;
                sel.dispatchEvent(new Event('change', { bubbles: true }));

                const nice = findServiceNameById(serviceId);
                const displayInput = document.getElementById(`service_display_name_${gid}`);

                // ✅ อย่าทับ ถ้าผู้ใช้เคย rename (หรือ import มาพร้อม rename)
                if (
                    displayInput &&
                    nice &&
                    !displayInput.dataset.userEdited &&
                    !displayInput.value.trim()
                ) {
                    displayInput.value = nice;
                }
            }
        });
    };

    apply();
    setTimeout(apply, 250);
    setTimeout(apply, 800);
}

function addServiceRow(decription = "", quantity = 1, price = 0, include = 0) {
    // Default to the first group's table if exists
    const defaultTbody = document.querySelector('[id^="services_table_body_"]');
    const tableBody = defaultTbody || document.getElementById('services_table')?.getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();

    const fullIncludeRow = document.getElementById('full_include_row');
    if (fullIncludeRow) {
        fullIncludeRow.cells[4].rowSpan += 1;
    }

    newRow.setAttribute('data-row-id', itemNumber);
    newRow.setAttribute('data-parent-id', 'null');
    // mark group id if present on table
    const groupId = tableBody.getAttribute('data-group-id');
    if (groupId) newRow.setAttribute('data-group-id', groupId);

    newRow.setAttribute('draggable', 'true');
    newRow.addEventListener('dragstart', handleDragStart);
    newRow.addEventListener('dragover', handleDragOver);
    newRow.addEventListener('dragleave', handleDragLeave);
    newRow.addEventListener('drop', handleDrop);

    newRow.innerHTML = `
        <td>${itemNumber}
        <input type="hidden" name="row_id[]" value="${itemNumber}">
        <input type="hidden" name="group_id[]" value="${groupId ? groupId : ''}">
        </td>
        <td><input type="text" name="item[]" placeholder="Enter item" value="${decription}"></td>
        <td><input type="number" name="quantity[]" value="${quantity}"></td>
        <td><input type="number" name="price[]" step="0.01" value="${price}"></td>
        <td ${(fullIncludeRow ? 'style="display: none"' : '')}></td>
        <td><input type="hidden" name="include[]" class="includeInput" value="0"></td>
    `;

    itemNumber++;

    const actionCell = newRow.cells[5];
    createActionButton(actionCell, 'Include', 'btn-primary', includeSubServiceRow);
    createActionButton(actionCell, 'Remove', 'btn-danger', removeServiceRow);
    createActionButton(actionCell, 'Add', 'btn-success', addSubServiceRow);

    if (include == 1) {
        includeSubServiceRow(actionCell.querySelector('.btn-primary'));
    }

    newRow.cells[2].firstChild.addEventListener('change', updateTotalAmount);
    newRow.cells[3].firstChild.addEventListener('change', updateTotalAmount);

    newRow.cells[2].firstChild.addEventListener('input', () => updateServiceTotalPrice(newRow));
    newRow.cells[3].firstChild.addEventListener('input', () => updateServiceTotalPrice(newRow));

    updateServiceTotalPrice(newRow);
}

function handleDragStart(event) {
    draggedRow = event.target;
    event.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const targetRow = event.target.closest('tr');
    if (targetRow && targetRow !== draggedRow) {
        highlightDropPosition(targetRow);
    }
}

function handleDragLeave(event) {
    const targetRow = event.target.closest('tr');
    if (targetRow && targetRow !== draggedRow) {
        removeDropHighlight(targetRow);
    }
}

function handleDrop(event) {
    event.preventDefault();

    const targetRow = event.target.closest('tr');
    if (targetRow && targetRow !== draggedRow) {
        moveDraggedRow(targetRow);
    }
}

function getLastRow(row) {
    let targetRowId = row.getAttribute('data-row-id');
    const parentRowId = row.getAttribute('data-parent-id');

    if (parentRowId !== 'null') {
        targetRowId = parentRowId;
    }

    // scope to the same tbody (service group) as the row
    const tableBody = row.closest('tbody') || document;
    const subRows = Array.from(tableBody.querySelectorAll(`tr[data-parent-id="${targetRowId}"]`));
    return subRows.length > 0 ? subRows[subRows.length - 1] : row;
}

function highlightDropPosition(targetRow) {
    const lastRow = getLastRow(targetRow);

    // Clear previous highlights
    document.querySelectorAll('tr').forEach(row => row.style.borderBottom = '');

    // Highlight the drop position
    lastRow.style.borderBottom = '3px solid #000';
}

function removeDropHighlight(targetRow) {
    const lastRow = getLastRow(targetRow);

    // Remove highlight from the last row
    lastRow.style.borderBottom = '';
}

function moveDraggedRow(targetRow) {
    const lastRow = getLastRow(targetRow);
    // Determine the tbody (group) to operate within
    const tableBody = targetRow.closest('tbody') || draggedRow.closest('tbody') || document.querySelector('[id^="services_table_body_"]') || document.querySelector('#services_table tbody');

    // Remove previous highlight
    lastRow.style.borderBottom = '';

    // Move the dragged row and its sub-rows within the same tbody
    tableBody.insertBefore(draggedRow, lastRow.nextSibling);

    moveSubRows(draggedRow, tableBody);

    // Reindex the rows after moving (tbody scoped)
    reindexServiceRows(tableBody);

    // Clear all highlights
    document.querySelectorAll('tr').forEach(row => row.style.borderBottom = '');
}

function moveSubRows(draggedRow, tableBody) {
    const draggedRowId = draggedRow.getAttribute('data-row-id');
    const localTable = tableBody || draggedRow.closest('tbody');
    const draggedSubRows = Array.from(localTable.querySelectorAll(`tr[data-parent-id="${draggedRowId}"]`)).reverse();

    draggedSubRows.forEach(subRow => {
        localTable.insertBefore(subRow, draggedRow.nextSibling);
    });
}

function updateServiceTotalPrice(row) {
    const includeButton = row.cells[5].querySelector('.btn-primary, .btn-secondary');
    const quantity = row.cells[2].firstChild.value;
    const price = row.cells[3].firstChild.value;
    let totalPrice = quantity * price;

    if (includeButton && includeButton.textContent == 'Include') {
        row.cells[4].innerText = `${totalPrice.toFixed(2)}`;
    } else {
        const rowId = row.getAttribute('data-row-id');
        totalPrice += calculateSubServiceTotalPrice(rowId);
        row.cells[4].innerText = `${totalPrice.toFixed(2)}`;
    }

}

function updateSubServiceTotalPrice(row) {

    const rowId = row.getAttribute('data-parent-id');
    const parentRow = getServiceRowById(rowId);
    const parentQuantity = parentRow.cells[2].firstChild.value;
    const parentPrice = parentRow.cells[3].firstChild.value;
    let totalPrice = parentQuantity * parentPrice;
    const includeButton = parentRow.cells[5].querySelector('.btn-primary, .btn-secondary');

    const childQuantity = row.cells[2].firstChild.value;
    const childPrice = row.cells[3].firstChild.value;
    const childTotalPrice = childQuantity * childPrice;
    row.cells[4].innerText = `${childTotalPrice.toFixed(2)}`;

    if (includeButton && includeButton.textContent == 'Exclude') {

        totalPrice += calculateSubServiceTotalPrice(rowId);
        const parentRows = getServiceRowById(rowId);
        parentRows.cells[4].innerText = `${totalPrice.toFixed(2)}`;
    }

}

function calculateSubServiceTotalPrice(parentRowId) {
    let total = 0;
    const parentRow = getServiceRowById(parentRowId);
    const tableBody = parentRow ? parentRow.closest('tbody') : document;
    const childRows = Array.from(tableBody.querySelectorAll(`tr[data-parent-id="${parentRowId}"]`));

    childRows.forEach(childRow => {
        const childQuantity = childRow.cells[2].firstChild.value;
        const childPrice = childRow.cells[3].firstChild.value;
        const childTotal = childQuantity * childPrice;
        total += childTotal;
    });

    return total;
}

function createActionButton(cell, buttonText, buttonClass, action) {
    const button = document.createElement('button');
    button.textContent = buttonText;
    button.type = 'button';
    button.classList.add('btn', buttonClass, 'mx-1');
    button.addEventListener('click', function () {
        action(this);
    });

    cell.appendChild(button);
}

function addSubServiceRow(button, parent_id = null, description = "", quantity = 1, price = 0) {

    // 1) หา parentRow ให้ได้ก่อน
    const parentRow = button?.closest?.('tr') || (typeof getServiceRowById === 'function' ? getServiceRowById(parent_id) : null);
    if (!parentRow) return;

    const parentRowId = parentRow.getAttribute('data-row-id');
    const tableBody = parentRow.closest('tbody');
    if (!tableBody) return;

    const groupId = tableBody.getAttribute('data-group-id');

    // 2) ทำ description ให้เป็น string ที่ใช้ได้แน่นอน
    let fixedDescription = description;
    try { fixedDescription = JSON.parse(`"${fixedDescription}"`); } catch (e) { }
    fixedDescription = (fixedDescription ?? "").toString();

    // 3) escape ค่าเพื่อกัน value="... แตก" (และกัน XSS)
    const escapeAttr = (s) =>
        String(s)
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    const safeDesc =
        (typeof cleanText === 'function')
            ? cleanText(fixedDescription)
            : escapeAttr(fixedDescription);

    // 4) สร้าง rowId + หา insertIndex ใน tbody แบบถูกต้อง
    const subRowCount = tableBody.querySelectorAll(`[data-parent-id='${parentRowId}']`).length + 1;
    const rowId = `${parentRowId}.${subRowCount}`;

    let insertIndex = parentRow.sectionRowIndex + 1; // ✅ index ใน tbody
    while (
        insertIndex < tableBody.rows.length &&
        tableBody.rows[insertIndex].getAttribute('data-parent-id') == parentRowId
    ) {
        insertIndex++;
    }

    const newRow = tableBody.insertRow(insertIndex);
    newRow.setAttribute('data-parent-id', parentRowId);
    newRow.setAttribute('data-row-id', rowId);
    if (groupId) newRow.setAttribute('data-group-id', groupId);

    newRow.addEventListener('dragover', handleDragOver);
    newRow.addEventListener('dragleave', handleDragLeave);
    newRow.addEventListener('drop', handleDrop);

    const includeButton = parentRow.cells?.[5]?.querySelector?.('.btn-primary, .btn-secondary');
    const fullIncludeRow = tableBody.querySelector('[id^="full_include_row_"]');

    const hideTotal =
        ((includeButton && includeButton.textContent.trim() !== 'Include') || !!fullIncludeRow);

    newRow.innerHTML = `
    <td>${rowId}
      <input type="hidden" name="row_id[]" value="${escapeAttr(rowId)}">
      <input type="hidden" name="group_id[]" value="${escapeAttr(groupId ? groupId : '')}">
    </td>
    <td><input type="text" name="item[]" placeholder="Enter item" value="${safeDesc}"></td>
    <td><input type="number" name="quantity[]" value="${escapeAttr(quantity)}"></td>
    <td><input type="number" name="price[]" step="0.01" value="${escapeAttr(price)}"></td>
    <td name="totalprice" ${hideTotal ? 'style="display: none"' : ''}></td>
    <td name="buttongroup"></td>
  `;

    // rowSpan updates
    if (includeButton && includeButton.textContent.trim() !== 'Include') {
        const rowspanCell = parentRow.cells?.[4];
        if (rowspanCell) rowspanCell.rowSpan += 1;
    }
    if (fullIncludeRow?.cells?.[4]) fullIncludeRow.cells[4].rowSpan += 1;

    const actionCell = newRow.cells[5];
    createActionButton(actionCell, 'Remove', 'btn-danger', removeSubServiceRow);

    newRow.cells[2].firstChild.addEventListener('change', updateTotalAmount);
    newRow.cells[3].firstChild.addEventListener('change', updateTotalAmount);

    newRow.cells[2].firstChild.addEventListener('input', () => updateSubServiceTotalPrice(newRow));
    newRow.cells[3].firstChild.addEventListener('input', () => updateSubServiceTotalPrice(newRow));

    updateSubServiceTotalPrice(newRow);
}


// Create a new Service Group UI (dropdown, include all, table)
function createServiceGroup() {
    groupCounter++;
    const groupId = `g${groupCounter}`;
    const container = document.getElementById('service_groups_container');

    const groupDiv = document.createElement('div');
    groupDiv.className = 'service-group card p-3 mb-3';
    groupDiv.id = `service_group_${groupId}`;

    groupDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
                <!-- สำคัญมาก: ต้องมี name="service_group_name[${groupId}]" -->
                <select id="service_dropdown_${groupId}" 
                data-group-id="${groupId}"
                        name="service_group_name[${groupId}]" 
                        class="form-select service-dropdown" 
                        style="min-width:250px;">
                    <option value="" selected>Select a service</option>
                </select>
                <p style="margin-top: 20px !important;margin-bottom: 5px;">*If you would like to rename this service, please enter the desired name in the field below.</p>
                <input type="text" id="service_display_name_${groupId}" name="service_display_name[${groupId}]">
            </div>
            <div>
                <button type="button" id="includeAllButton_${groupId}" class="btn btn-primary mx-1">Include All</button>
                <input type="hidden" id="includeAllInput_${groupId}" name="include_all_${groupId}" value="0">
                <button type="button" class="btn btn-danger" id="removeServiceGroup_${groupId}">Remove Service</button>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-hover" data-group-id="${groupId}">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Description</th>
                        <th>Qty.</th>
                        <th>Unit Price</th>
                        <th>Total Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="services_table_body_${groupId}" data-group-id="${groupId}">
                </tbody>
            </table>
            <button type="button" id="add_item_${groupId}" class="btn btn-primary" style="margin-bottom:20px;">Add new description</button>
        </div>
    `;

    container.appendChild(groupDiv);

    // populate dropdown options from cache if available
    const dropdown = groupDiv.querySelector(`#service_dropdown_${groupId}`);
    const displayInput = document.getElementById(`service_display_name_${groupId}`);
    displayInput.addEventListener('blur', function () {
        if (!this.value.trim()) {
            if (dropdown && dropdown.selectedIndex > 0) {
                this.value = dropdown.options[dropdown.selectedIndex].textContent;
            }
        }
    });

    if (serviceDataReady && serviceDataCache) {
        populateServiceDropdown(dropdown, serviceDataCache);
    } else {
        // รอ loader เสร็จแล้วค่อย populate
        const interval = setInterval(() => {
            if (serviceDataReady && serviceDataCache) {
                populateServiceDropdown(dropdown, serviceDataCache);
                clearInterval(interval);
            }
        }, 100);
    }

    // attach events
    groupDiv.querySelector(`#add_item_${groupId}`).addEventListener('click', function () {
        addServiceRowToGroup(groupId);
    });

    groupDiv.querySelector(`#includeAllButton_${groupId}`).addEventListener('click', function () {
        const btn = this;
        const val = document.getElementById(`includeAllInput_${groupId}`);
        if (btn.innerText === 'Include All') {
            includeAllServiceRowForGroup(groupId);
        } else {
            excludeAllServiceRowForGroup(groupId);
        }
        updateTotalAmount();
    });

    groupDiv.querySelector(`#removeServiceGroup_${groupId}`).addEventListener('click', function () {
        try { removeGroupRemarks(groupId); } catch (e) { console.warn('Failed to remove group remarks', e); }
        groupDiv.remove();
        updateTotalAmount();
    });

    // service select change
    dropdown.addEventListener('change', function () {
        const serviceId = this.value;
        if (!serviceId) return;

        const selectedOption = this.options[this.selectedIndex];
        const displayInput = document.getElementById(`service_display_name_${groupId}`);

        // ✅ auto-fill display name ถ้าว่าง
        if (displayInput && !displayInput.value.trim()) {
            displayInput.value =
                selectedOption.dataset.defaultName ||
                selectedOption.textContent;
        }

        const displayName =
            displayInput?.value?.trim() ||
            selectedOption.dataset.defaultName ||
            selectedOption.textContent;

        const details = getServiceDataById(serviceId);
        if (!details) return;

        // 🔥🔥🔥 จุดที่ขาดไป
        const tbody = document.getElementById(`services_table_body_${groupId}`);
        if (!tbody) return;

        // เคลียร์ row เก่าก่อน
        tbody.innerHTML = '';

        // เพิ่ม rows จาก services.json
        details.items.forEach((item, i) => {
            addServiceRowToGroup(
                groupId,
                item,
                details.quantities?.[i] ?? 1,
                details.prices?.[i] ?? 0,
                0
            );
        });

        updateMonthlyPrice(details);
        updateTotalAmount();

        // อัปเดต remark
        setServiceInDescription(
            {
                ...details,
                display_name: displayName
            },
            groupId
        );
    });
    return groupId;
}

function populateServiceDropdown(dropdown, data) {
    if (!dropdown) return;

    dropdown.innerHTML = '';
    dropdown.appendChild(new Option('Select a service', ''));

    for (const category in data) {
        if (!Object.prototype.hasOwnProperty.call(data, category)) continue;

        const optgroup = document.createElement('optgroup');
        optgroup.label = category;

        data[category].forEach(service => {
            const option = document.createElement('option');
            option.value = service.id;         // KEY
            option.textContent = service.name; // DISPLAY
            option.dataset.defaultName = service.name;
            optgroup.appendChild(option);
        });

        dropdown.appendChild(optgroup);
    }
}

function findServiceNameById(id) {
    const target = String(id || '').trim();
    if (!target || !serviceDataCache) return '';

    for (const cat in serviceDataCache) {
        if (!Object.prototype.hasOwnProperty.call(serviceDataCache, cat)) continue;
        const list = serviceDataCache[cat];
        if (!Array.isArray(list)) continue;

        for (const s of list) {
            if (String(s?.id || '').trim() === target) {
                return String(s.name || '').trim();
            }
        }
    }
    return '';
}

function addServiceRowToGroup(groupId, description = '', quantity = 1, price = 0, include = 0) {
    const tbody = document.getElementById(`services_table_body_${groupId}`);

    let fixedDescription = description;

    console.log('RAW:', description);
    console.log('FIXED:', fixedDescription)

    // Count current rows in this group (excluding full_include_row)
    const currentRows = Array.from(tbody.querySelectorAll('tr[data-parent-id="null"]'))
        .filter(r => !r.id || !r.id.startsWith('full_include_row_'));
    const groupItemNumber = currentRows.length + 1;

    const newRow = tbody.insertRow();
    newRow.setAttribute('data-row-id', groupItemNumber);
    newRow.setAttribute('data-parent-id', 'null');
    newRow.setAttribute('data-group-id', groupId);
    newRow.setAttribute('draggable', 'true');
    newRow.addEventListener('dragstart', handleDragStart);
    newRow.addEventListener('dragover', handleDragOver);
    newRow.addEventListener('dragleave', handleDragLeave);
    newRow.addEventListener('drop', handleDrop);

    newRow.innerHTML = `
        <td>${groupItemNumber}<input type="hidden" name="row_id[]" value="${groupItemNumber}"><input type="hidden" name="group_id[]" value="${groupId}"></td>
        <td><input type="text" name="item[]" placeholder="Enter item" value="${cleanText(fixedDescription)}"></td>
        <td><input type="number" name="quantity[]" value="${quantity}"></td>
        <td><input type="number" name="price[]" step="0.01" value="${price}"></td>
        <td data-total-cell></td>
        <td><input type="hidden" name="include[]" class="includeInput" value="0"></td>
    `;

    const actionCell = newRow.cells[5];
    createActionButton(actionCell, 'Include', 'btn-primary', includeSubServiceRow);
    createActionButton(actionCell, 'Remove', 'btn-danger', removeServiceRow);
    createActionButton(actionCell, 'Add', 'btn-success', addSubServiceRow);

    newRow.cells[2].firstChild.addEventListener('change', updateTotalAmount);
    newRow.cells[3].firstChild.addEventListener('change', updateTotalAmount);
    newRow.cells[2].firstChild.addEventListener('input', () => updateServiceTotalPrice(newRow));
    newRow.cells[3].firstChild.addEventListener('input', () => updateServiceTotalPrice(newRow));

    updateServiceTotalPrice(newRow);
}

function includeAllServiceRowForGroup(groupId) {
    const tbody = document.getElementById(`services_table_body_${groupId}`);
    if (!tbody) return;
    tbody.querySelectorAll('tr').forEach(tr => tr.querySelector('[data-total-cell]')?.style.setProperty('display', 'none'));
    const newRow = tbody.insertRow(0);
    newRow.id = `full_include_row_${groupId}`;
    newRow.setAttribute('data-parent-id', 'null');
    newRow.innerHTML = `<td></td><td></td><td></td><td></td><td data-total-cell></td><td></td>`;
    newRow.cells[4].rowSpan = tbody.querySelectorAll('tr').length + 1;
    newRow.style.height = '0px';
    newRow.style.border = 'none';
    const includeButton = document.getElementById(`includeAllButton_${groupId}`);
    includeButton.classList.remove('btn-primary');
    includeButton.classList.add('btn-secondary');
    includeButton.innerText = 'Exclude All';
    document.getElementById(`includeAllInput_${groupId}`).value = '1';
}

function excludeAllServiceRowForGroup(groupId) {
    document.getElementById(`full_include_row_${groupId}`)?.remove();
    const tbody = document.getElementById(`services_table_body_${groupId}`);
    if (!tbody) return;
    tbody.querySelectorAll('tr').forEach(tr => tr.querySelector('[data-total-cell]')?.style.removeProperty('display'));
    const includeButton = document.getElementById(`includeAllButton_${groupId}`);
    if (includeButton) {
        includeButton.classList.add('btn-primary');
        includeButton.classList.remove('btn-secondary');
        includeButton.innerText = 'Include All';
    }
    const input = document.getElementById(`includeAllInput_${groupId}`);
    if (input) input.value = '0';
}

function excludeAllServiceRow() {
    // remove any global full include rows (legacy)
    document.querySelectorAll('[id^="full_include_row_"]').forEach(r => r.remove());

    // ensure each group's visible total cells are restored
    const tbodies = document.querySelectorAll('[id^="services_table_body_"]');
    tbodies.forEach(tbody => {
        tbody.querySelectorAll('tr').forEach(tr => {
            const parentRowId = tr.getAttribute('data-parent-id');
            const parentTr = parentRowId ? getServiceRowById(parentRowId) : null;
            const parentIncludeButton = parentTr?.cells[5].querySelector('.btn-primary, .btn-secondary');

            if (!parentTr || parentIncludeButton?.textContent === 'Include') {
                tr.cells[4].style.removeProperty('display');
            }
        });
    });

    // reset any standalone legacy includeAll button if present
    const includeButton = document.getElementById("includeAllButton");
    if (includeButton) {
        includeButton.classList.add("btn-primary");
        includeButton.classList.remove("btn-secondary");
        includeButton.innerText = "Include All";
    }
    const legacyInput = document.getElementById("includeAllInput");
    if (legacyInput) legacyInput.value = "0";
}

function includeAllServiceRow() {
    // Apply include-all across all group tbodies for backward compatibility
    const tbodies = document.querySelectorAll('[id^="services_table_body_"]');
    tbodies.forEach(tbody => {
        tbody.querySelectorAll('tr').forEach(tr => tr.cells[4].style.display = 'none');
        const newRow = tbody.insertRow(0);
        const groupId = tbody.getAttribute('data-group-id') || '';
        newRow.id = `full_include_row_${groupId}`;
        newRow.setAttribute('data-parent-id', 'null');
        newRow.innerHTML = `<td></td><td></td><td></td><td></td><td data-total-cell></td><td></td>`;
        newRow.cells[4].rowSpan = tbody.querySelectorAll('tr').length + 1;
        newRow.style.height = '0px';
        newRow.style.border = 'none';
        // update group include button if present
        const includeButton = document.getElementById(`includeAllButton_${groupId}`) || document.getElementById('includeAllButton');
        if (includeButton) {
            includeButton.classList.remove('btn-primary');
            includeButton.classList.add('btn-secondary');
            includeButton.innerText = 'Exclude All';
        }
        const input = document.getElementById(`includeAllInput_${groupId}`) || document.getElementById('includeAllInput');
        if (input) input.value = '1';
    });
}

function includeSubServiceRow(button) {
    const row = button.closest('tr');
    const rowId = row.getAttribute('data-row-id');
    const isExcluding = button.textContent.trim() === 'Exclude';

    button.textContent = isExcluding ? 'Include' : 'Exclude';
    button.classList.toggle('btn-secondary', !isExcluding);
    button.classList.toggle('btn-primary', isExcluding);

    if (isExcluding) {
        unmergeSubServicesTotalPrice(rowId);
        updateServiceTotalPrice(row);
        row.querySelector('.includeInput').value = '0';
    } else {
        mergeSubServicesTotalPrice(rowId);
        const tableBody = row.closest('tbody');
        const childRows = tableBody ? tableBody.querySelectorAll(`tr[data-parent-id="${rowId}"]`) : document.querySelectorAll(`tr[data-parent-id="${rowId}"]`);
        childRows.forEach(updateSubServiceTotalPrice);
        row.querySelector('.includeInput').value = '1';
    }
}

function unmergeSubServicesTotalPrice(parentRowId) {
    const parentRow = getServiceRowById(parentRowId);
    const parentTd = parentRow.children[4];
    const tableBody = parentRow.closest('tbody');
    const childRows = tableBody ? tableBody.querySelectorAll(`tr[data-parent-id="${parentRowId}"]`) : document.querySelectorAll(`tr[data-parent-id="${parentRowId}"]`);
    const groupId = tableBody ? tableBody.getAttribute('data-group-id') : '';
    const fullIncludeRow = document.getElementById(`full_include_row_${groupId}`) || null;

    if (!fullIncludeRow) {
        childRows.forEach(child => {
            child.children[4].style.removeProperty('display');
        });
    }

    parentTd.rowSpan = 1;
}

function mergeSubServicesTotalPrice(parentRowId) {
    const parentRow = getServiceRowById(parentRowId);
    const tableBody = parentRow.closest('tbody');
    const childRows = tableBody ? tableBody.querySelectorAll(`tr[data-parent-id="${parentRowId}"]`) : document.querySelectorAll(`tr[data-parent-id="${parentRowId}"]`);

    const childRowsCount = childRows.length;
    childRows.forEach(child => {
        const childTd = child.children[4];
        childTd.style.display = 'none';

    });

    const rowspanCell = parentRow.children[4];
    rowspanCell.rowSpan = childRowsCount + 1;
}

function removeServiceRow(button) {
    const row = button.closest('tr');
    const rowId = row.getAttribute('data-row-id');
    const tableBody = row.closest('tbody');

    itemNumber--;
    deleteServiceAndSubServiceRow(rowId, tableBody);
    reindexServiceRows(tableBody);
}

function removeSubServiceRow(button) {
    // Get the closest row to delete
    const row = button.closest('tr');
    const rowId = row.getAttribute('data-row-id');
    const parentRowId = row.getAttribute('data-parent-id');

    const parentRow = getServiceRowById(parentRowId);
    const tableBody = row.closest('tbody');

    updateServiceRowSpan(parentRowId, -1);

    deleteServiceAndSubServiceRow(rowId, tableBody);
    reindexServiceRows(tableBody);
    updateServiceTotalPrice(parentRow)
}

function updateServiceRowSpan(parentRowId, increment) {
    const parentRow = getServiceRowById(parentRowId);
    const parentTd = parentRow.children[4];
    const currentRowSpan = parseInt(parentTd.rowSpan, 10) || 1;
    if (currentRowSpan != 1) {
        parentTd.rowSpan = currentRowSpan + increment;
    }
}


function deleteServiceAndSubServiceRow(rowId, tableBody) {
    const rowsToDelete = tableBody.querySelectorAll(`tr[data-parent-id='${rowId}'], tr[data-row-id='${rowId}']`);
    rowsToDelete.forEach(row => row.remove());
    updateTotalAmount();
}

function reindexServiceRows(tableBody) {
    const rootRows = tableBody.querySelectorAll('tr[data-parent-id=null]:not(#full_include_row)');
    rootRows.forEach((row, index) => {
        const newRowId = `${index + 1}`;
        reindexSubServiceRows(row, newRowId, tableBody);
    });

    tableBody.querySelectorAll('.reindexed').forEach(row => row.classList.remove('reindexed'));
}

function reindexSubServiceRows(row, newRowId, tableBody) {
    const oldRowId = row.getAttribute('data-row-id');
    row.setAttribute('data-row-id', newRowId);
    // row.querySelector('td').textContent = newRowId;
    const groupId = tableBody.getAttribute('data-group-id') || row.getAttribute('data-group-id') || '';
    row.querySelector('td').innerHTML = `${newRowId}<input type="hidden" name="row_id[]" value="${newRowId}"/ ><input type="hidden" name="group_id[]" value="${groupId}"/ >`;

    const childRows = Array.from(tableBody.querySelectorAll(`tr[data-parent-id='${oldRowId}']:not(.reindexed)`));
    childRows.forEach((childRow, index) => {
        const childRowId = `${newRowId}.${index + 1}`;
        childRow.setAttribute('data-row-id', childRowId);
        childRow.setAttribute('data-parent-id', newRowId);
        childRow.querySelector('td').innerHTML = `${childRowId}<input type="hidden" name="row_id[]" value="${childRowId}"/ ><input type="hidden" name="group_id[]" value="${groupId}"/ >`;
        childRow.classList.add('reindexed');

        reindexSubServiceRows(childRow, childRowId, tableBody);
    });
}

function getServiceRowById(rowId) {
    // Search across group-specific tbodies first
    const tbodies = document.querySelectorAll('[id^="services_table_body_"]');
    for (const tbody of tbodies) {
        const found = tbody.querySelector(`tr[data-row-id="${rowId}"][data-parent-id="null"]`);
        if (found) return found;
    }
    // fallback to global selector
    return document.querySelector(`tr[data-row-id="${rowId}"][data-parent-id="null"]`);
}

// ============================================

// Add event listeners for discount and VAT input fields
document.getElementById('discount').addEventListener('input', function () {
    updateTotalAmount(); // Call the updateTotalAmount function whenever the discount value changes
});

// Add event listener for discount type dropdown menu
document.getElementById('discount_type').addEventListener('change', function () {
    updateTotalAmount(); // Call the updateTotalAmount function whenever the discount type changes
});

document.getElementById('vat_percentage').addEventListener('input', function () {
    updateTotalAmount(); // Call the updateTotalAmount function whenever the VAT percentage changes
});

function updateTotalAmount() {
    // Sum totals across all service group tables
    const tbodies = document.querySelectorAll('[id^="services_table_body_"]');
    let totalAmount = 0;
    tbodies.forEach(tbody => {
        const rows = Array.from(tbody.querySelectorAll('tr')).filter(r => !r.id || !r.id.startsWith('full_include_row_'));
        rows.forEach(row => {
            const qtyInput = row.cells[2]?.querySelector('input');
            const priceInput = row.cells[3]?.querySelector('input');
            if (!qtyInput || !priceInput) return;
            const quantity = parseFloat(qtyInput.value) || 0;
            const price = parseFloat(priceInput.value) || 0;
            totalAmount += quantity * price;
        });
    });

    document.getElementById('total_amount_label').textContent = formatCurrency(totalAmount) + ' ' + getCurrencySymbol(); // Update total amount with formatted currency
    document.getElementById('total_amount_input').value = totalAmount;
    // Update any group-level full_include_row cells with their group totals
    document.querySelectorAll('[id^="full_include_row_"]').forEach(fullRow => {
        const groupId = fullRow.id.replace('full_include_row_', '');
        // compute group total
        const tbody = document.getElementById(`services_table_body_${groupId}`);
        if (!tbody) return;
        let groupTotal = 0;
        const rows = Array.from(tbody.querySelectorAll('tr')).filter(r => !r.id || !r.id.startsWith(`full_include_row_${groupId}`));
        rows.forEach(row => {
            const qty = parseFloat(row.cells[2]?.querySelector('input')?.value) || 0;
            const price = parseFloat(row.cells[3]?.querySelector('input')?.value) || 0;
            groupTotal += qty * price;
        });
        fullRow.cells[4].textContent = groupTotal.toFixed(2);
    });

    const discountType = document.getElementById('discount_type').value;
    const discountValue = parseFloat(document.getElementById('discount').value);

    let totalAmountWithDiscount = totalAmount;

    if (discountType === 'percentage') {
        totalAmountWithDiscount *= (100 - discountValue) / 100;
    } else if (discountType === 'fixed') {
        totalAmountWithDiscount -= discountValue;
    }

    totalAmountWithDiscount = Math.max(totalAmountWithDiscount, 0);

    const vatPercentage = parseFloat(document.getElementById('vat_percentage').value);
    const vatAmount = (totalAmountWithDiscount * vatPercentage) / 100;

    document.getElementById('vat_amount_label').textContent = formatCurrency(vatAmount) + ' ' + getCurrencySymbol();
    document.getElementById('vat_amount_input').value = vatAmount;

    const totalAmountWithVAT = totalAmountWithDiscount + vatAmount;
    document.getElementById('total_amount_with_vat_label').textContent = formatCurrency(totalAmountWithVAT) + ' ' + getCurrencySymbol(); // Update total amount with VAT with formatted currency
    document.getElementById('total_amount_with_vat_input').value = totalAmountWithVAT;

}

document.addEventListener('DOMContentLoaded', function () {
    const currencyRadios = document.querySelectorAll('input[name="currency"]');

    currencyRadios.forEach(function (radio) {
        radio.addEventListener('change', function () {
            updateTotalAmount();
        });
    });
});



var popup = document.getElementById('history_popup');
document.body.appendChild(popup);
var btn = document.getElementById("openHistory");
btn.onclick = function () {
    var closeBtn = popup.getElementsByClassName("close")[0];
    closeBtn.onclick = function () {
        document.body.style.overflow = "auto";
        popup.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == popup) {
            document.body.style.overflow = "auto";
            popup.style.display = "none";
        }
    };

    document.body.style.overflow = "hidden";
    popup.style.display = "flex";
};
// Attach Add Service Group button
const addGroupBtn = document.getElementById('add_service_group');

if (addGroupBtn) {
    addGroupBtn.addEventListener('click', function () {

        // 1️⃣ สร้าง group ใหม่
        const newGroupId = createServiceGroup();

        // 2️⃣ populate dropdown เมื่อ data พร้อม
        if (serviceDataReady && serviceDataCache) {
            const dd = document.getElementById(`service_dropdown_${newGroupId}`);
            if (dd) {
                populateServiceDropdown(dd, serviceDataCache);
            }
        }

    });
}

function getCurrencySymbol() {
    const currencyInputs = document.getElementsByName('currency');
    for (let i = 0; i < currencyInputs.length; i++) {
        if (currencyInputs[i].checked) {
            switch (currencyInputs[i].value) {
                case 'USD': return '$';
                case 'GBP': return '£';
                case 'EUR': return '€';
                case 'SGD': return 'S$';
                default: return 'THB';
            }
        }
    }
}

function updateQuotationCurrency() {
    const selectedCurrencySymbol = getCurrencySymbol();
    const currencyElements = document.querySelectorAll('.currency-value');

    currencyElements.forEach(function (element) {
        const value = element.getAttribute('data-value');
        if (value === "Included") {
            element.textContent = "Included";
        } else {
            element.textContent = `${selectedCurrencySymbol} ${numberWithCommas(value)}`;
        }
    });

    document.querySelectorAll('.static-currency-symbol').forEach(function (element) {
        element.textContent = selectedCurrencySymbol;
    });
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrency(amount) {
    return amount.toLocaleString('en', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function updateMonthlyPrice(serviceDetails) {
    const monthlyPriceDropdown = document.getElementById('monthly_price');
    const monthNumberInput = document.getElementById('month_number_input');
    const monthlyPriceInput = document.getElementById('monthly_price_input');

    if (serviceDetails.monthly_price) {

        monthlyPriceDropdown.style.display = 'inline-block';

        // default ไม่มีค่า
        monthlyPriceDropdown.value = '';

        // ซ่อนช่องเดือน
        monthNumberInput.style.display = 'none';

        monthlyPriceInput.value = '';

    } else {
        monthlyPriceDropdown.style.display = 'none';
        monthNumberInput.style.display = 'none';
        monthlyPriceInput.value = 'false';
        return;
    }

    monthlyPriceDropdown.onchange = function () {

        if (this.value === 'Month') {

            monthNumberInput.style.display = 'inline-block';

            let number = parseInt(monthNumberInput.value) || 1;
            number = Math.max(1, Math.min(12, number));

            monthNumberInput.value = number;
            monthlyPriceInput.value = `${number} Month`;

        } else if (this.value === 'Year') {

            monthNumberInput.style.display = 'none';
            monthlyPriceInput.value = 'Year';

        } else {

            monthNumberInput.style.display = 'none';
            monthlyPriceInput.value = '';

        }
    };

    monthNumberInput.oninput = function () {

        let number = parseInt(this.value) || 1;
        number = Math.max(1, Math.min(12, number));

        this.value = number;
        monthlyPriceInput.value = `${number} Month`;
    };
}

function addServicePackageRowWithStructure(serviceDetails) {
    const tableBody = document.getElementById('services_table')?.getElementsByTagName('tbody')[0];
    const structure = serviceDetails.structure || [];

    for (let i = 0; i < serviceDetails.items.length; i++) {
        const item = serviceDetails.items[i];
        const quantity = serviceDetails.quantities[i];
        const price = serviceDetails.prices[i];
        const rowData = structure[i];

        if (!rowData || rowData.row_id === rowData.parent_id) {
            // Parent row
            addServiceRow(item, quantity, price, rowData?.row_id || `p${i + 1}`);
        } else {
            // Sub row
            addSubServiceRow(null, rowData.parent_id, item, quantity, price, rowData.row_id);
        }
    }
}

function addServicePackageRow(serviceDetails) {
    const tableBody = document.getElementById('services_table')?.getElementsByTagName('tbody')[0];
    for (let i = 0; i < serviceDetails.items.length; i++) {
        const newRow = tableBody.insertRow();
        newRow.setAttribute('data-row-id', itemNumber);
        newRow.setAttribute('data-parent-id', 'null');
        const groupId = tableBody?.getAttribute('data-group-id') || '';

        const rowIdCell = newRow.insertCell();
        rowIdCell.textContent = itemNumber;

        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'row_id[]';
        hiddenInput.value = itemNumber;
        rowIdCell.appendChild(hiddenInput);
        const hiddenGroup = document.createElement('input');
        hiddenGroup.type = 'hidden';
        hiddenGroup.name = 'group_id[]';
        hiddenGroup.value = groupId;
        rowIdCell.appendChild(hiddenGroup);

        itemNumber++;

        const itemCell = newRow.insertCell();
        itemCell.innerHTML = `<input type="text" name="item[]" value="${serviceDetails.items[i]}">`;

        const quantityCell = newRow.insertCell();
        quantityCell.innerHTML = `<input type="number" name="quantity[]" value="${serviceDetails.quantities[i]}">`;

        const priceCell = newRow.insertCell();
        priceCell.innerHTML = `<input type="number" name="price[]" step="0.01" value="${serviceDetails.prices[i]}">`;

        const totalPriceCell = newRow.insertCell();
        totalPriceCell.textContent = (serviceDetails.quantities[i] * serviceDetails.prices[i]).toFixed(2);

        const actionCell = newRow.insertCell();
        actionCell.innerHTML = `<input type="hidden" name="include[]" class="includeInput" value="0">`;

        createActionButton(actionCell, 'Include', 'btn-primary', includeSubServiceRow);
        createActionButton(actionCell, 'Remove', 'btn-danger', removeServiceRow);
        createActionButton(actionCell, 'Add', 'btn-success', addSubServiceRow);

        newRow.setAttribute('draggable', 'true');
        newRow.addEventListener('dragstart', handleDragStart);
        newRow.addEventListener('dragover', handleDragOver);
        newRow.addEventListener('dragleave', handleDragLeave);
        newRow.addEventListener('drop', handleDrop);

        newRow.cells[2].firstChild.addEventListener('change', updateTotalAmount);
        newRow.cells[3].firstChild.addEventListener('change', updateTotalAmount);

        newRow.cells[2].firstChild.addEventListener('input', () => updateServiceTotalPrice(newRow));
        newRow.cells[3].firstChild.addEventListener('input', () => updateServiceTotalPrice(newRow));
    }
}

// ============================================

async function getServicePackageDropdown() {
    if (serviceDataReady) return;

    try {
        const res = await fetch(serviceData.json); // ⭐ สำคัญ
        if (!res.ok) throw new Error('services.json fetch failed');

        const data = await res.json();
        serviceDataCache = data;
        serviceDataReady = true;

        // เติม dropdown ทุกตัวที่มีอยู่แล้ว
        document.querySelectorAll('.service-dropdown')
            .forEach(dd => populateServiceDropdown(dd, data));

        console.log('✅ services.json loaded', data);
    } catch (err) {
        console.error('❌ Failed to load services.json', err);
    }
}

document.addEventListener('DOMContentLoaded', getServicePackageDropdown);

function getServiceDataById(serviceId) {
    if (!serviceDataCache) return null;

    for (const category in serviceDataCache) {
        for (const service of serviceDataCache[category]) {
            if (service.id === serviceId) {
                return { ...service, category };
            }
        }
    }
    return null;
}


function rebuildRemarksTextarea() {
    const description = document.getElementById('remark');
    if (!description) return;

    let parts = [];
    for (const [cat, keyMap] of currentRemarksByCategory) {
        if (!keyMap || keyMap.size === 0) continue;

        // services first
        for (const [key, count] of keyMap) {
            if (count <= 0) continue;
            if (key.startsWith('svc:')) {
                const svc = key.replace('svc:', '');
                parts.push(`Service: ${svc}`);
            }
        }

        // then custom descriptions
        for (const [key, count] of keyMap) {
            if (count <= 0) continue;
            if (key.startsWith('custom:')) {
                const ckey = key.replace('custom:', '');
                const fullCustom = custom_desc[ckey];
                if (fullCustom) parts.push(fullCustom.trim());
            }
        }

        parts.push('');
    }

    if (parts.length > 0 && parts[parts.length - 1] === '') parts.pop();
    description.value = parts.join('\n');
}

function setServiceInDescription(serviceDetails, groupId = null) {
    console.log('setServiceInDescription called', serviceDetails, 'groupId=', groupId);
    const description = document.getElementById('remark');
    if (!description) {
        console.warn('Remark element (#remark) not found');
        return;
    }

    serviceDetails = serviceDetails || {};
    const svcName = (serviceDetails.display_name || serviceDetails.name || '').trim();
    const custom_key = serviceDetails.custom_description || '';
    const category = serviceDetails.category || 'General';

    // If group is specified, first remove any old remarks from this group
    if (groupId) {
        removeGroupRemarks(groupId);
    }

    // ensure category map exists
    if (!currentRemarksByCategory.has(category)) {
        currentRemarksByCategory.set(category, new Map());
    }
    const keyMap = currentRemarksByCategory.get(category);

    // ensure group record exists
    if (groupId) {
        if (!groupRemarksMap.has(groupId)) groupRemarksMap.set(groupId, new Set());
    }

    // helper to add a key with counts and register group ownership
    function addKey(cat, key) {
        const map = currentRemarksByCategory.get(cat) || new Map();
        const prev = map.get(key) || 0;
        map.set(key, prev + 1);
        currentRemarksByCategory.set(cat, map);

        if (groupId) {
            const set = groupRemarksMap.get(groupId) || new Set();
            set.add(`${cat}||${key}`);
            groupRemarksMap.set(groupId, set);
        }
    }

    if (svcName) {
        addKey(category, `svc:${svcName}`);
    }

    if (custom_key && custom_desc[custom_key]) {
        addKey(category, `custom:${custom_key}`);
    }

    // rebuild the textarea from currentRemarksByCategory
    rebuildRemarksTextarea();
    console.log('Remark updated to grouped format:', description.value);
}

function removeGroupRemarks(groupId) {
    if (!groupRemarksMap.has(groupId)) return;
    const entries = groupRemarksMap.get(groupId);

    // Decrement reference count for each remark that this group added
    for (const entry of entries) {
        const [cat, key] = entry.split('||');
        const keyMap = currentRemarksByCategory.get(cat);
        if (!keyMap) continue;

        const prev = keyMap.get(key) || 0;
        if (prev <= 1) {
            // Last group using this remark, delete it
            keyMap.delete(key);
        } else {
            // Other groups still using this remark, just decrement
            keyMap.set(key, prev - 1);
        }

        // Clean up empty category map
        if (keyMap.size === 0) currentRemarksByCategory.delete(cat);
    }

    // Remove the group's entry from the map
    groupRemarksMap.delete(groupId);

    // Rebuild remarks textarea to reflect changes
    rebuildRemarksTextarea();
}

// Generate the options and optgroups
document.addEventListener('DOMContentLoaded', async function () {
    const dropdown = document.getElementById('team_dropdown');
    if (!dropdown) return;

    let teamMembers = {};

    // โหลด team-members.json
    async function loadTeamMembers() {
        try {
            if (!window.teamMemberData || !teamMemberData.json) {
                throw new Error('teamMemberData.json URL not found');
            }

            const res = await fetch(teamMemberData.json);
            if (!res.ok) throw new Error('team-members.json fetch failed');

            return await res.json();
        } catch (err) {
            console.error('❌ Failed to load team members', err);
            return {};
        }
    }

    // สร้าง dropdown
    function createOptions(data) {
        dropdown.innerHTML = '<option value="">Select team member</option>';

        for (const team in data) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = team;

            for (const key in data[team]) {
                const member = data[team][key];
                const option = document.createElement('option');
                option.value = key;
                option.textContent = member.full_name || key;
                optgroup.appendChild(option);
            }

            dropdown.appendChild(optgroup);
        }
    }

    // โหลด + render
    teamMembers = await loadTeamMembers();
    createOptions(teamMembers);

    // change event (อันเดียวพอ)
    dropdown.addEventListener('change', function () {
        const selectedKey = this.value;
        if (!selectedKey) return;

        let found = null;
        for (const team in teamMembers) {
            if (teamMembers[team][selectedKey]) {
                found = teamMembers[team][selectedKey];
                break;
            }
        }

        document.getElementById('company_phone').value = found?.company_phone || '';
        document.getElementById('company_email').value = found?.company_email || '';
        document.getElementById('full_name').value = found?.full_name || '';
    });
});

// History import buttons: decode Base64 payload then JSON.parse
function b64ToUtf8(b64) {
    // base64 -> bytes -> UTF-8 string
    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
}

document.addEventListener('click', async function (e) {
    const btn = e.target.closest && e.target.closest('.import-quote-btn');
    if (!btn) return;

    e.stopPropagation();
    e.preventDefault(); // กันกรณีปุ่มอยู่ใน form

    const b64 = btn.getAttribute('data-details-b64');
    if (!b64) {
        console.error('Import button missing data-details-b64');
        return;
    }

    try {
        const json = b64ToUtf8(b64);
        const details = JSON.parse(json);
        window.__lastImportDetails = details;
console.log('Saved to window.__lastImportDetails', details);

        if (typeof importPreviousQuote === 'function') {
            await importPreviousQuote(details);     // ✅ รอให้ import เสร็จก่อน
            restoreServiceDropdown(details);        // ✅ ค่อย restore dropdown
        } else {
            console.error('importPreviousQuote is not defined');
        }
    } catch (err) {
        console.error('Failed to decode/parse quote details for import', err);
        alert('Import failed: invalid history data. ดู console สำหรับรายละเอียด');
    }
});




function getServiceDisplayName(groupId) {
    const input = document.getElementById(`service_display_name_${groupId}`);
    if (input && input.value.trim()) {
        return input.value.trim(); // user override
    }

    const dropdown = document.getElementById(`service_dropdown_${groupId}`);
    if (dropdown && dropdown.selectedIndex > 0) {
        return dropdown.options[dropdown.selectedIndex].textContent; // fallback
    }

    return ''; // ไม่มีจริง ๆ
}