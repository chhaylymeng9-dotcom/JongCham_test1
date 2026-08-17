/* ---------- lessonContent ----------
Reading-page bodies and self-check pairs, keyed by lesson id. Only
lesson 5 has an entry — LessonFlow sends any lesson with no body
straight to the questions, same as before this content existed.
Content is the reference nervous-system lesson, used verbatim.
--------------------------------- */

export const LESSON_BODY = {
  5: `
  <!-- ១ -->
  <section id="s1">
    <h2><span class="n">១</span> គោលបំណងមេរៀន</h2>
    <ul class="b">
      <li>ពន្យល់និយមន័យនៃតម្រូវប្រសាទ និងសារៈសំខាន់របស់វា។</li>
      <li>ស្គាល់រចនាសម្ព័ន្ធ និងមុខងាររបស់ណឺរ៉ូន <span class="en-i">(Neuron)</span>។</li>
      <li>ពន្យល់ដំណើរនៃសារប្រសាទពីអ្នកទទួលរំញោចទៅកាន់សរីរាង្គឆ្លើយតប។</li>
      <li>បែងចែកប្រព័ន្ធប្រសាទកណ្ដាល និងប្រព័ន្ធប្រសាទជាយ។</li>
      <li>ពន្យល់អំពី Reflex action និង Reflex arc។</li>
      <li>ស្គាល់ផ្នែកសំខាន់ៗនៃខួរក្បាល និងមុខងាររបស់វា។</li>
    </ul>
  </section>

  <!-- ២ · ៣ -->
  <section id="s2">
    <h2><span class="n">២</span> និយមន័យតម្រូវប្រសាទ</h2>
    <p>តម្រូវប្រសាទ <span class="en-i">(Nervous Regulation)</span> គឺជាដំណើរការដែលប្រព័ន្ធប្រសាទទទួលរំញោចពីបរិស្ថានខាងក្រៅ ឬខាងក្នុង បញ្ជូនព័ត៌មានទៅកាន់មជ្ឈមណ្ឌលប្រសាទ ដើម្បីវិភាគ និងបញ្ជាឱ្យសរីរាង្គឆ្លើយតបយ៉ាងសមស្រប។</p>
    <div class="call ex">
      <b>ឧទាហរណ៍</b>
      ពេលដៃប៉ះវត្ថុក្តៅ → អ្នកទទួលរំញោចទទួលសញ្ញា → សារប្រសាទត្រូវបានបញ្ជូន → សាច់ដុំកន្ត្រាក់ → ដកដៃចេញ។
    </div>

    <h3>៣ · សារៈសំខាន់នៃប្រព័ន្ធប្រសាទ</h3>
    <ul class="b">
      <li>ទទួលព័ត៌មានពីបរិស្ថាន និងពីខាងក្នុងរាងកាយ។</li>
      <li>បញ្ជូនព័ត៌មានទៅកាន់មជ្ឈមណ្ឌលប្រសាទ។</li>
      <li>វិភាគ និងសម្របសម្រួលការឆ្លើយតប។</li>
      <li>គ្រប់គ្រងចលនាស្ម័គ្រចិត្ត និងចលនាមិនស្ម័គ្រចិត្តមួយចំនួន។</li>
      <li>ជួយឱ្យរាងកាយរក្សាសមតុល្យ និងឆ្លើយតបបានរហ័ស។</li>
    </ul>
  </section>

  <!-- ៤ · ៥ -->
  <section id="s4">
    <h2><span class="n">៤</span> ណឺរ៉ូន <span class="en-i">(Neuron)</span></h2>
    <p>ណឺរ៉ូន គឺជាកោសិកាឯកទេសរបស់ប្រព័ន្ធប្រសាទ ដែលអាចទទួល និងបញ្ជូនសារប្រសាទ។</p>

    <figure>
      <svg viewBox="0 0 760 250" role="img" aria-label="រូបណឺរ៉ូន">
        <defs>
          <marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="#8B8877"/>
          </marker>
        </defs>
        <!-- dendrites -->
        <g stroke="#2F3A2E" stroke-width="4" fill="none" stroke-linecap="round">
          <path d="M120 125 L58 78 M58 78 L30 62 M58 78 L44 50"/>
          <path d="M120 125 L54 125 M54 125 L26 112 M54 125 L26 138"/>
          <path d="M120 125 L58 172 M58 172 L30 188 M58 172 L44 200"/>
        </g>
        <!-- soma -->
        <circle cx="152" cy="125" r="38" fill="#EAF0E6" stroke="#2F3A2E" stroke-width="4"/>
        <circle cx="152" cy="125" r="13" fill="#2F3A2E"/>
        <!-- axon with myelin -->
        <line x1="190" y1="125" x2="600" y2="125" stroke="#2F3A2E" stroke-width="5"/>
        <g fill="#F2C33C" stroke="#C8931B" stroke-width="2.5">
          <rect x="228" y="107" width="70" height="36" rx="18"/>
          <rect x="320" y="107" width="70" height="36" rx="18"/>
          <rect x="412" y="107" width="70" height="36" rx="18"/>
          <rect x="504" y="107" width="70" height="36" rx="18"/>
        </g>
        <!-- terminals -->
        <g stroke="#2F3A2E" stroke-width="4" fill="none" stroke-linecap="round">
          <path d="M600 125 L648 96 M648 96 L690 86"/>
          <path d="M600 125 L654 125 M654 125 L698 125"/>
          <path d="M600 125 L648 154 M648 154 L690 164"/>
        </g>
        <g fill="#2F3A2E"><circle cx="694" cy="84" r="7"/><circle cx="702" cy="125" r="7"/><circle cx="694" cy="166" r="7"/></g>
        <!-- labels -->
        <g font-family="Siemreap, Khmer OS Siemreap, sans-serif" font-size="15" fill="#23271F">
          <text x="14" y="30">ដង់ដ្រាយ</text>
          <text x="128" y="205">តួកោសិកា</text>
          <text x="330" y="90">អាក់សុង</text>
          <text x="292" y="182">ស្រទាប់មីអេលីន</text>
          <text x="612" y="222">ចុងអាក់សុង</text>
        </g>
        <g stroke="#8B8877" stroke-width="1.6" fill="none" marker-end="url(#ar)">
          <path d="M44 36 L52 56"/>
          <path d="M162 192 L156 168"/>
          <path d="M356 96 L344 116"/>
          <path d="M336 172 L338 148"/>
          <path d="M660 210 L668 176"/>
        </g>
      </svg>
      <figcaption>ផ្នែកសំខាន់ៗរបស់ណឺរ៉ូន</figcaption>
    </figure>

    <div class="tw">
    <table>
      <tr><th>ផ្នែក</th><th>ពាក្យអង់គ្លេស</th><th>មុខងារ</th></tr>
      <tr><td><b>ដង់ដ្រាយ</b></td><td>Dendrite</td><td>ទទួលសារពីកោសិកាផ្សេង ឬពីអ្នកទទួលរំញោច</td></tr>
      <tr><td><b>តួកោសិកា</b></td><td>Cell body / Soma</td><td>ផ្ទុកស្នូល និងគ្រប់គ្រងសកម្មភាពកោសិកា</td></tr>
      <tr><td><b>អាក់សុង</b></td><td>Axon</td><td>បញ្ជូនសារប្រសាទចេញពីតួកោសិកា</td></tr>
      <tr><td><b>ស្រទាប់មីអេលីន</b></td><td>Myelin sheath</td><td>ការពារ និងបង្កើនល្បឿនបញ្ជូនសារតាមអាក់សុង</td></tr>
      <tr><td><b>ចុងអាក់សុង</b></td><td>Axon terminals</td><td>បញ្ជូនសញ្ញាទៅកោសិកាគោលដៅ</td></tr>
    </table>
    </div>

    <h3>៥ · ប្រភេទណឺរ៉ូន</h3>
    <div class="trio">
      <div><b>ណឺរ៉ូនទទួលអារម្មណ៍</b><span>Sensory neuron — បញ្ជូនព័ត៌មានពីអ្នកទទួលរំញោចទៅ CNS</span></div>
      <div><b>ណឺរ៉ូនចលនា</b><span>Motor neuron — បញ្ជូនបញ្ជាពី CNS ទៅសាច់ដុំ ឬក្រពេញ</span></div>
      <div><b>ណឺរ៉ូនភ្ជាប់</b><span>Interneuron — ភ្ជាប់ និងដំណើរការព័ត៌មាននៅក្នុង CNS</span></div>
    </div>
  </section>

  <!-- ៦ · ៧ -->
  <section id="s7">
    <h2><span class="n">៦</span> រំញោច · សារប្រសាទ · ស៊ីណាប់</h2>
    <p><b>រំញោច</b> <span class="en-i">(Stimulus)</span> គឺជាការប្រែប្រួលដែលអាចត្រូវបានទទួលស្គាល់ដោយអ្នកទទួលរំញោច។</p>
    <p><b>សារប្រសាទ</b> <span class="en-i">(Nerve impulse)</span> គឺជាសញ្ញាអគ្គិសនី/អេឡិចត្រូគីមីដែលឆ្លងកាត់ណឺរ៉ូន ដើម្បីបញ្ជូនព័ត៌មាន។</p>
    <div class="call ex">
      <b>ឧទាហរណ៍</b>
      ពន្លឺ → អ្នកទទួលនៅភ្នែក → សារប្រសាទ → ខួរក្បាល → ការយល់ឃើញ។
    </div>

    <h3>៧ · ស៊ីណាប់ (Synapse)</h3>
    <p>Synapse គឺជាតំបន់តភ្ជាប់រវាងណឺរ៉ូនមួយ និងកោសិកាផ្សេងទៀត ឬណឺរ៉ូនមួយទៀត។</p>
    <ul class="b">
      <li>សារប្រសាទ<b>មិន</b>ឆ្លងកាត់ចន្លោះស៊ីណាប់ដោយផ្ទាល់ទេ។</li>
      <li>នៅចុងអាក់សុង សារគីមីដែលហៅថា <span class="en-i">Neurotransmitter</span> ត្រូវបានបញ្ចេញ។</li>
      <li>វាឆ្លងកាត់ចន្លោះស៊ីណាប់ ហើយភ្ជាប់ទៅ receptor របស់កោសិកាគោលដៅ។</li>
      <li>ដំណើរនេះធ្វើឱ្យសារប្រសាទបន្តទៅកាន់កោសិកាបន្ទាប់។</li>
    </ul>
  </section>

  <!-- ៨ · ៩ -->
  <section id="s8">
    <h2><span class="n">៨</span> ប្រព័ន្ធប្រសាទរបស់មនុស្ស</h2>
    <div class="trio" style="grid-template-columns:1fr 1fr">
      <div><b>ប្រព័ន្ធប្រសាទកណ្ដាល (CNS)</b><span>ខួរក្បាល (Brain) និងខួរឆ្អឹងខ្នង (Spinal cord)</span></div>
      <div><b>ប្រព័ន្ធប្រសាទជាយ (PNS)</b><span>សរសៃប្រសាទដែលភ្ជាប់ CNS ទៅសរីរាង្គ — ផ្លូវនាំចូល (sensory) និងផ្លូវនាំចេញ (motor)</span></div>
    </div>

    <h3>៩ · ប្រព័ន្ធប្រសាទស្វ័យប្រវត្តិ</h3>
    <p>Autonomic nervous system គ្រប់គ្រងមុខងាររបស់សរីរាង្គដែលភាគច្រើនមិនស្ថិតក្រោមការបញ្ជាដោយចេតនា ដូចជា ចង្វាក់បេះដូង ការរំលាយអាហារ និងការពង្រីក/រួមតូចរបស់សរសៃឈាម។</p>
    <div class="tw">
    <table>
      <tr><th>ផ្នែក</th><th>តួនាទីទូទៅ</th><th>ឧទាហរណ៍</th></tr>
      <tr><td><b>Sympathetic</b></td><td>ត្រៀមឆ្លើយតបពេលមានភាពតានតឹង ឬគ្រោះថ្នាក់</td><td>បង្កើនចង្វាក់បេះដូង</td></tr>
      <tr><td><b>Parasympathetic</b></td><td>ជួយឱ្យរាងកាយសម្រាក និងស្តារសកម្មភាពធម្មតា</td><td>ជំរុញការរំលាយអាហារ</td></tr>
    </table>
    </div>
  </section>

  <!-- ១០ · ១១ -->
  <section id="s10">
    <h2><span class="n">១០</span> ខួរក្បាល និងខួរឆ្អឹងខ្នង</h2>
    <div class="tw">
    <table>
      <tr><th>ផ្នែក</th><th>មុខងារសំខាន់</th><th>ឧទាហរណ៍</th></tr>
      <tr><td><b>ខួរធំ</b><br><span class="en-i">Cerebrum</span></td><td>ការគិត ការចងចាំ ការយល់ដឹង អារម្មណ៍ និងចលនាដោយចេតនា</td><td>គិត ដោះស្រាយបញ្ហា និយាយ</td></tr>
      <tr><td><b>ខួរតូច</b><br><span class="en-i">Cerebellum</span></td><td>សម្របសម្រួលចលនា និងរក្សាលំនឹង</td><td>ដើរ រក្សាលំនឹង</td></tr>
      <tr><td><b>Medulla oblongata</b></td><td>គ្រប់គ្រងមុខងារស្វ័យប្រវត្តិសំខាន់ៗ</td><td>ដង្ហើម ចង្វាក់បេះដូង</td></tr>
      <tr><td><b>Hypothalamus</b></td><td>គ្រប់គ្រងសីតុណ្ហភាព ស្រេកឃ្លាន និងសមតុល្យខាងក្នុង</td><td>Thermoregulation</td></tr>
    </table>
    </div>

    <h3>១១ · ខួរឆ្អឹងខ្នង (Spinal cord)</h3>
    <ul class="b">
      <li>ជាផ្នែកមួយនៃប្រព័ន្ធប្រសាទកណ្ដាល។</li>
      <li>បញ្ជូនសាររវាងខួរក្បាល និងផ្នែកផ្សេងៗនៃរាងកាយ។</li>
      <li>ជាមជ្ឈមណ្ឌលសំខាន់សម្រាប់ Reflex មួយចំនួន។</li>
    </ul>
  </section>

  <!-- ១២ · ១៣ · ១៤ -->
  <section id="s12">
    <h2><span class="n">១២</span> ប្រតិកម្មឆ្លុះ <span class="en-i">(Reflex action)</span></h2>
    <p>ជាការឆ្លើយតប<b>រហ័ស</b> និង<b>មិនស្ម័គ្រចិត្ត</b>ចំពោះរំញោច ដែលជួយការពាររាងកាយ។</p>

    <h3>១២.១ · Reflex arc</h3>
    <div class="flow">
      <span class="hot">រំញោច</span><i>→</i>
      <span>Receptor</span><i>→</i>
      <span>Sensory neuron</span><i>→</i>
      <span>CNS</span><i>→</i>
      <span>Motor neuron</span><i>→</i>
      <span>Effector</span><i>→</i>
      <span class="hot">ការឆ្លើយតប</span>
    </div>

    <h3>១៣ · ឧទាហរណ៍៖ ដកដៃចេញពីវត្ថុក្តៅ</h3>
    <ol class="steps">
      <li>ស្បែកទទួលកម្ដៅខ្លាំងជារំញោច។</li>
      <li>Receptor នៅស្បែកបង្កើតសញ្ញាប្រសាទ។</li>
      <li>Sensory neuron បញ្ជូនសញ្ញាទៅខួរឆ្អឹងខ្នង។</li>
      <li>Interneuron ភ្ជាប់ព័ត៌មានទៅ Motor neuron។</li>
      <li>Motor neuron បញ្ជាសាច់ដុំដៃឱ្យកន្ត្រាក់។</li>
      <li>ដៃត្រូវបានដកចេញយ៉ាងរហ័ស។</li>
      <li>ខួរក្បាលក៏ទទួលព័ត៌មាន ដើម្បីឱ្យយើងដឹងថាឈឺ ឬក្តៅ។</li>
    </ol>

    <div class="call key">
      <b>ចងចាំ</b>
      ទទួល → បញ្ជូន → វិភាគ/បញ្ជា → ឆ្លើយតប
    </div>

    <h3>១៥ · ប្រៀបធៀប Sensory និង Motor neuron</h3>
    <div class="tw">
    <table>
      <tr><th>លក្ខណៈ</th><th>Sensory neuron</th><th>Motor neuron</th></tr>
      <tr><td><b>ទិសដៅ</b></td><td>Receptor → CNS</td><td>CNS → Effector</td></tr>
      <tr><td><b>មុខងារ</b></td><td>នាំព័ត៌មានអារម្មណ៍</td><td>នាំបញ្ជាទៅសរីរាង្គឆ្លើយតប</td></tr>
      <tr><td><b>គោលដៅ</b></td><td>ខួរក្បាល / ខួរឆ្អឹងខ្នង</td><td>សាច់ដុំ ឬក្រពេញ</td></tr>
    </table>
    </div>
  </section>

  <!-- ១៦ -->
  <section id="s16">
    <h2><span class="n">១៦</span> សង្ខេបមេរៀន</h2>
    <ul class="b">
      <li>តម្រូវប្រសាទជាការគ្រប់គ្រង និងសម្របសម្រួលការឆ្លើយតបរបស់រាងកាយតាមរយៈប្រព័ន្ធប្រសាទ។</li>
      <li>ណឺរ៉ូនជាឯកតាមូលដ្ឋានសម្រាប់ទទួល និងបញ្ជូនសារប្រសាទ។</li>
      <li>CNS = ខួរក្បាល + ខួរឆ្អឹងខ្នង។</li>
      <li>PNS = សរសៃប្រសាទដែលភ្ជាប់ CNS ទៅកាន់រាងកាយ។</li>
      <li>Reflex action ជាការឆ្លើយតបរហ័ស និងមិនស្ម័គ្រចិត្ត។</li>
      <li>Sensory neuron នាំព័ត៌មានចូល CNS ខណៈ Motor neuron នាំបញ្ជាចេញទៅ Effector។</li>
    </ul>
  </section>

  <!-- ១៧ -->
  <section id="s17">
    <h2><span class="n">១៧</span> ពាក្យគន្លឹះ ខ្មែរ–អង់គ្លេស</h2>
    <div class="gl">
      <div>តម្រូវប្រសាទ <span>Nervous regulation</span></div>
      <div>ណឺរ៉ូន <span>Neuron</span></div>
      <div>រំញោច <span>Stimulus</span></div>
      <div>សារប្រសាទ <span>Nerve impulse</span></div>
      <div>អ្នកទទួលរំញោច <span>Receptor</span></div>
      <div>ស៊ីណាប់ <span>Synapse</span></div>
      <div>សារធាតុបញ្ជូនប្រសាទ <span>Neurotransmitter</span></div>
      <div>ខួរក្បាល <span>Brain</span></div>
      <div>ខួរឆ្អឹងខ្នង <span>Spinal cord</span></div>
      <div>ប្រព័ន្ធប្រសាទកណ្ដាល <span>CNS</span></div>
      <div>ប្រព័ន្ធប្រសាទជាយ <span>PNS</span></div>
      <div>ប្រតិកម្មឆ្លុះ <span>Reflex action</span></div>
      <div>សរីរាង្គឆ្លើយតប <span>Effector</span></div>
    </div>
  </section>
`,
};

export const LESSON_QA = {
  5: [
    ["តើតម្រូវប្រសាទជាអ្វី?", "ជាដំណើរការដែលប្រព័ន្ធប្រសាទទទួលព័ត៌មាន វិភាគ/សម្របសម្រួល និងបញ្ជាឱ្យរាងកាយឆ្លើយតប។"],
    ["តើណឺរ៉ូនជាអ្វី?", "ជាកោសិកាឯកទេសដែលទទួល និងបញ្ជូនសារប្រសាទ។"],
    ["តើ CNS មានអ្វីខ្លះ?", "ខួរក្បាល និងខួរឆ្អឹងខ្នង។"],
    ["តើ Sensory neuron មានមុខងារអ្វី?", "បញ្ជូនព័ត៌មានពី Receptor ទៅ CNS។"],
    ["តើ Motor neuron មានមុខងារអ្វី?", "បញ្ជូនបញ្ជាពី CNS ទៅ Effector។"],
    ["តើ Reflex action ជាអ្វី?", "ការឆ្លើយតបរហ័ស និងមិនស្ម័គ្រចិត្តចំពោះរំញោច។"],
    ["តើ Synapse មានតួនាទីអ្វី?", "ជាតំបន់ដែលអនុញ្ញាតឱ្យសារប្រសាទបន្តពីណឺរ៉ូនមួយទៅកោសិកាបន្ទាប់ តាមរយៈសារធាតុបញ្ជូនប្រសាទ។"],
    ["តើអ្វីទៅជា Reflex arc?", "លំដាប់ផ្លូវនៃសារពី Receptor តាម Sensory neuron ទៅមជ្ឈមណ្ឌលប្រសាទ ហើយតាម Motor neuron ទៅ Effector។"],
  ],
};
